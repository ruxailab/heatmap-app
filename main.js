import { webContents } from 'electron'
import { app, BrowserWindow, WebContentsView, ipcMain } from 'electron/main'

import * as path from 'path'

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

function handleUrlToGo(value, inputUrl, mainWin, webView) {
  console.log('Input value received in main process:', value)
  const offsetY = value[1] // offset of the toolbar
  if (mainWin && inputUrl) {
    mainWin.contentView.addChildView(webView)
    webView.webContents.loadURL(inputUrl)

    webView.webContents.on(
      'did-finish-load',
      () => resizeWebView(undefined, offsetY, mainWin, webView),
      mainWin.webContents.send('webview-load-finished'),
    )

    webView.webContents.on(
      'did-fail-load',
      (_, _, errorDescription) => {
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
 * @param {WebView} webView - The WebView whose test has ended.
 */
function handleEndTest(mainWin, webView) {
  if (webView.webContents) {
    //TODO: add saving data
    endWebView(mainWin, webView)
  }
}

function endWebView(mainWin, webView) {
  webView.webContents.closeDevTools()
  mainWin.contentView.removeChildView(webView)
}

app.whenReady().then(() => {
  const mainWin = createWindow()
  let webView = new WebContentsView()
  var inputUrl

  ipcMain.on('urlToGo', (_, value) => {
    inputUrl = validateAndFixUrl(value[0])
    handleUrlToGo(value, inputUrl, mainWin, webView)
  })
  ipcMain.on('backAction', () => handleBackAction(webView))
  ipcMain.on('forwardAction', () => handleForwardAction(webView))
  ipcMain.on('resetURL', () => handleResetUrl(inputUrl, webView))
  ipcMain.on('endTest', () => handleEndTest(mainWin, webView))

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
