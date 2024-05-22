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

app.whenReady().then(() => {
  const mainWin = createWindow()
  const webView = new WebContentsView()
  var inputUrl

  ipcMain.on('urlToGo', (_, value) => {
    console.log('Input value received in main process:', value)
    inputUrl = validateAndFixUrl(value[0])
    const offsetY = value[1] // offset of the toolbar
    if (mainWin && inputUrl) {
      mainWin.contentView.addChildView(webView)
      webView.webContents.loadURL(inputUrl)

      webView.webContents.on('did-finish-load', () =>
        resizeWebView(undefined, offsetY, mainWin, webView),
      )

      webView.webContents.on('did-navigate', (_, url) => {
        mainWin.webContents.send('url-updated', url)
      })

      mainWin.on('resize', () => {
        resizeWebView(undefined, offsetY, mainWin, webView)
      })
    }
  })

  ipcMain.on('backAction', () => {
    if (webView.webContents.canGoBack()) {
      webView.webContents.goBack()
    }
  })

  ipcMain.on('forwardAction', () => {
    if (webView.webContents.canGoForward()) {
      webView.webContents.goForward()
    }
  })

  ipcMain.on('resetURL', () => {
    if (inputUrl) webView.webContents.loadURL(inputUrl)
  })

  mainWin.webContents.on('did-navigate-in-page', (_, url) => {
    console.log('did naviage in page: ' + url)
  })

  mainWin.webContents.on('did-navigate', (_, url) => {
    console.log('did navigate to: ' + url)
  })

  mainWin.webContents.on('did-frame-navigate', (_, url) => {
    console.log('did frame navigate to: ' + url)
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
  if (!mainWindow) {
    console.log('mainWindow not ready')
    return
  }
  if (!webView) {
    console.log('webView not ready')
    return
  }
  const { width, height } = mainWindow.getContentBounds()
  const { oldX, oldY } = webView.getBounds()

  if (offsetX == undefined) offsetX = oldX
  if (offsetY == undefined) offsetY = oldY

  webView.setBounds({ x: offsetX, y: offsetY, width, height })
}
