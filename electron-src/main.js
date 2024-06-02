import {
  app,
  ipcMain,
  BrowserWindow,
  WebContentsView,
} from 'electron/main'

import * as path from 'path'
import ClickTracker from './clicks/ClickTracker.js'

function createWindow() {
  const mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(new URL('.', import.meta.url).pathname, 'preload.js'),
    },
  })

  mainWin.loadFile('dist/index.html')

  return mainWin
}

function handleUrlToGo(offsetY, inputUrl, mainWin, webView, clickTracker) {
  if (mainWin && inputUrl) {
    mainWin.contentView.addChildView(webView)
    webView.webContents.loadURL(inputUrl)

    webView.webContents.on('did-finish-load', () => {
      resizeWebView(undefined, offsetY, mainWin, webView)
      clickTracker.startTracking()
      webView.webContents.executeJavaScript(`
        document.addEventListener('click', function(e) {
          window.electronAPI.sendClick(e.clientX, e.clientY)
        });
     `)

      mainWin.webContents.send('webview-load-finished')
    })

    webView.webContents.on(
      'did-fail-load',
      (_event, _errorCode, errorDescription) => {
        mainWin.webContents.send('webview-load-failed', errorDescription)
        endWebView(mainWin, webView)
      },
    )

    webView.webContents.on('did-navigate', (_, url) => {
      mainWin.webContents.send('url-updated', url)
    })

    mainWin.on('resize', () => {
      resizeWebView(undefined, offsetY, mainWin, webView)
    })
  }
}

function handleBackAction(webView) {
  if (webView.webContents.canGoBack()) webView.webContents.goBack()
}

function handleForwardAction(webView) {
  if (webView.webContents.canGoForward()) webView.webContents.goForward()
}

function handleResetUrl(inputUrl, webView) {
  if (inputUrl) webView.webContents.loadURL(inputUrl)
}

/**
 * Handles the end of a test.
 *
 * This function is responsible for closing the developer tools
 * and destroying the web contents of the provided WebView when a test ends.
 * Used once the user has confirmed that the test has ended.
 *
 * @param {BrowserWindow} mainWin - The window where webView is attached to
 * @param {WebView} webView - The WebView whose test has ended.
 */
function handleEndTest(mainWin, webView, clickTracker) {
  if (webView.webContents) {
    //TODO: add saving data
    const clicks = clickTracker.getClicks()
    console.log(clicks)
    endWebView(mainWin, webView)
  }
}

function endWebView(mainWin, webView) {
  webView.webContents.closeDevTools()
  mainWin.contentView.removeChildView(webView)
}

app.whenReady().then(() => {
  const mainWin = createWindow()
  let webView = new WebContentsView({
    webPreferences: {
      preload: path.join(
        new URL('.', import.meta.url).pathname,
        'preloadView.js',
      ),
    },
  })
  let clickTracker = new ClickTracker()
  let inputUrl

  ipcMain.on('urlToGo', (_, value) => {
    inputUrl = validateAndFixUrl(value[0])
    console.log('Input value received in main process:', value)
    handleUrlToGo(value[1], inputUrl, mainWin, webView, clickTracker)
  })
  ipcMain.on('backAction', () => handleBackAction(webView))
  ipcMain.on('forwardAction', () => handleForwardAction(webView))
  ipcMain.on('resetURL', () => handleResetUrl(inputUrl, webView))
  ipcMain.on('endTest', () => handleEndTest(mainWin, webView, clickTracker))

  ipcMain.on('click', (_, x, y) => {
    console.log('click at:', x, y)
    clickTracker.trackClick(x, y)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function validateAndFixUrl(inputUrl) {
  // add http or https to url if it doesn't starts With
  const urlRegex = /^(https?):\/\//
  return urlRegex.test(inputUrl) ? inputUrl : 'https://' + inputUrl
}

function resizeWebView(offsetX = 0, offsetY = 0, mainWindow, webView) {
  if (!mainWindow || !webView) {
    console.log('mainWindow or webView not ready')
    return
  }

  const { width, height } = mainWindow.getContentBounds()
  const { x: oldX, y: oldY } = webView.getBounds()

  offsetX = offsetX === undefined ? oldX : offsetX
  offsetY = offsetY === undefined ? oldY : offsetY

  webView.setBounds({ x: offsetX, y: offsetY, width, height })
}
