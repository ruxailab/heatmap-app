import { app, BrowserWindow, ipcMain } from 'electron/main'

import * as path from 'path'

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(new URL('.', import.meta.url).pathname, 'preload.js'),
    },
  })

  win.loadFile('dist/index.html')
  // const view1 = new WebContentsView()
  // win.contentView.addChildView(view1)
  // view1.webContents.loadURL('https://electronjs.org')
  // view1.setBounds({ x: 0, y: 0, width: 1000, height: 400 })
  return win
}

app.whenReady().then(() => {
  const win = createWindow()

  ipcMain.on('urlToGo', (_, value) => {
    console.log('Input value received in main process:', value)
    const inputUrl = validateAndFixUrl(value)
    if (win && inputUrl) {
      win.loadURL(inputUrl)
    }
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
