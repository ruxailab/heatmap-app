import { app, ipcMain, BrowserWindow, WebContentsView } from 'electron/main'
import { screen, Menu, MenuItem, shell } from 'electron'

import * as path from 'path'
import ClickTracker from './clicks/ClickTracker.js'

function createWindow() {
  const mainWin = new BrowserWindow({
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(new URL('.', import.meta.url).pathname, 'preload.js'),
    },
  })

  Menu.setApplicationMenu(createMenu())
  mainWin.loadFile('dist/index.html')

  return mainWin
}

function createMenu() {
  const menu = new Menu()

  const viewMenu = new Menu()
  viewMenu.append(new MenuItem({ label: 'Reload', role: 'reload' }))
  viewMenu.append(
    new MenuItem({ label: 'Toggle Fullscreen', role: 'togglefullscreen' }),
  )
  viewMenu.append(new MenuItem({ label: 'Zoom In', role: 'zoomin' }))
  viewMenu.append(new MenuItem({ label: 'Zoom Out', role: 'zoomout' }))
  viewMenu.append(new MenuItem({ label: 'Reset Zoom', role: 'resetzoom' }))
  viewMenu.append(
    new MenuItem({ label: 'Toggle Developer Tools', role: 'toggledevtools' }),
  )

  const helpMenu = new Menu()
  helpMenu.append(
    new MenuItem({
      label: 'Documentation',
      click: () => {
        shell.openExternal(
          'https://github.com/vGerJ02/ruxailab-testing-app/wiki',
        )
      },
    }),
  )
  helpMenu.append(
    new MenuItem({
      label: 'Check for Updates',
      click: () => {
        shell.openExternal(
          'https://github.com/vGerJ02/ruxailab-testing-app/releases',
        )
      },
    }),
  )
  helpMenu.append(
    new MenuItem({
      label: 'Report an Issue',
      click: () => {
        shell.openExternal(
          'https://github.com/vGerJ02/ruxailab-testing-app/issues',
        )
      },
    }),
  )

  menu.append(new MenuItem({ label: 'View', submenu: viewMenu }))
  menu.append(new MenuItem({ label: 'Help', submenu: helpMenu }))

  return menu
}


/**
 * Creates a new WebContentsView and sets up event handlers for various WebView events.
 *
 * @param {BrowserWindow} mainWin - The main window in which the WebView is created.
 * @param {number} offsetY - The offset in the Y direction for the WebView.
 * @param {ClickTracker} clickTracker - An object that tracks clicks in the WebView.
 *
 * @returns {WebContentsView} webView - The created WebView.
 */
function createWebView(mainWin, offsetY, clickTracker) {
  const webView = new WebContentsView({
    webPreferences: {
      preload: path.join(
        new URL('.', import.meta.url).pathname,
        'preloadView.js',
      ),
    },
  })

  webView.webContents.on('did-finish-load', async () => {
    console.log('[LOG] url finished loading')
    resizeWebView(undefined, offsetY, mainWin, webView)
    mainWin.webContents.send('webview-load-finished')
    //
    // let dimensions
    // try {
    //   dimensions = await webView.webContents.executeJavaScript(`
    //   new Promise((resolve) => {
    //     const body = document.body;
    //     const html = document.documentElement;
    //     const width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
    //     const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    //     resolve({ width, height });
    //   })
    //   `)
    // } catch (err) {
    //   console.log(err)
    //   webView.webContents.openDevTools({ mode: 'detach' })
    //   return
    // }
    //
    // clickTracker.setDimensions(
    //   webView.webContents.getURL(),
    //   dimensions.width,
    //   dimensions.height,
    // )
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

      let dimensions
      try {
        dimensions = await webView.webContents.executeJavaScript(`
      new Promise((resolve) => {
        const body = document.body;
        const html = document.documentElement;
        const width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
        const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        resolve({ width, height });
      })
      `)
      } catch (err) {
        console.log(err)
        webView.webContents.openDevTools({ mode: 'detach' })
        return
      }

      clickTracker.setDimensions(
        webView.webContents.getURL(),
        dimensions.width,
        dimensions.height,
      )
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
 * @param {WebContentsView} webView - The WebView whose test has ended.
 * @param {ClickTracker} clickTracker - The ClickTracker instance used to track clicks.
 */
function handleEndTest(mainWin, webView, clickTracker) {
  if (webView.webContents) {
    //TODO: add saving data
    const clicks = clickTracker.getClicks()
    const { width, height } = webView.getBounds()
    mainWin.webContents.send(
      'end-clicks',
      clicks,
      { width, height },
      clickTracker.getDimensions(),
    )
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
  let webView = null
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
  // add http or https to url if it doesn't start With
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

  webView.setBounds({
    x: offsetX,
    y: offsetY,
    width: width - offsetX,
    height: height - offsetY,
  })
}
