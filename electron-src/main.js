import { app, ipcMain, BrowserWindow, WebContentsView } from 'electron/main'
import { screen } from 'electron'

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

function createWebView(mainWin, offsetY, clickTracker) {
  const webView = new WebContentsView({
    webPreferences: {
      preload: path.join(
        new URL('.', import.meta.url).pathname,
        'preloadView.js',
      ),
    },
  })

  webView.webContents.on('did-finish-load', () => {
    console.log('[LOG] url finished loading')
    resizeWebView(undefined, offsetY, mainWin, webView)
    mainWin.webContents.send('webview-load-finished')
  })

  webView.webContents.on('input-event', async (_event, input) => {
    if (input.type === 'mouseDown') {
      const screenPoint = screen.getCursorScreenPoint()
      const windowPoint = mainWin.getContentBounds()

      let scrollPosition
      try {
        scrollPosition = await webView.webContents.executeJavaScript(
          `
            new Promise((resolve) => { 
              resolve({ x: window.scrollX, y: window.scrollY})
            });
            `,
        )
      } catch (err) {
        console.log(err)
        webView.webContents.openDevTools({ mode: 'detach' })
        return
      }

      const x = screenPoint.x - windowPoint.x + scrollPosition.x
      const y = screenPoint.y - windowPoint.y - offsetY + scrollPosition.y

      const url = webView.webContents.getURL()
      clickTracker.trackClick(x, y, url)
      console.log('mouse down at:', x, y, url)
    }
  })

  webView.webContents.on(
    'did-fail-load',
    (_event, _errorCode, errorDescription) => {
      mainWin.webContents.send('webview-load-failed', errorDescription)
      endWebView(mainWin, webView)
    },
  )

  webView.webContents.on('did-navigate', (_, url) => {
    console.log('Navigating to: ', url)
    mainWin.webContents.send('url-updated', url !== 'about:blank' ? url : '')
  })

  mainWin.on('resize', () => {
    resizeWebView(undefined, offsetY, mainWin, webView)
  })
  return webView
}

function handleUrlToGo(inputUrl, mainWin, webView) {
  if (mainWin && inputUrl && webView) {
    mainWin.contentView.addChildView(webView)
    webView.setVisible(true)
    webView.webContents.loadURL(inputUrl)
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
    const { width, height } = webView.getBounds()
    mainWin.webContents.send('end-clicks', clicks, { width, height })
    console.log(clicks)
    clickTracker.reset()
    endWebView(mainWin, webView)
  }
}

function endWebView(mainWin, webView) {
  webView.webContents.loadURL('about:blank')
  webView.setVisible(false)
  mainWin.contentView.removeChildView(webView)
}

app.whenReady().then(() => {
  const mainWin = createWindow()
  let webView = undefined
  let clickTracker = new ClickTracker()
  let inputUrl = ''

  ipcMain.on('urlToGo', (_, value) => {
    inputUrl = validateAndFixUrl(value[0])
    console.log('Input value received in main process:', value)
    if (!webView) webView = createWebView(mainWin, value[1], clickTracker)

    // Start tracking timer on the first web load
    webView.webContents.once('did-finish-load', () =>
      clickTracker.startTracking(),
    )

    handleUrlToGo(inputUrl, mainWin, webView)
  })
  ipcMain.on('backAction', () => handleBackAction(webView))
  ipcMain.on('forwardAction', () => handleForwardAction(webView))
  ipcMain.on('resetURL', () => handleResetUrl(inputUrl, webView))
  ipcMain.on('endTest', () => handleEndTest(mainWin, webView, clickTracker))

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
