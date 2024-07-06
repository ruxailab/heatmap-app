const { contextBridge, ipcRenderer } = require('electron')
// When using the following import statement from ES, the app crashes
// import { contextBridge, ipcRenderer } from 'electron'

// Expose a restricted subset of ipcRenderer to the renderer process
let validChannels = [
  'urlToGo',
  'backAction',
  'forwardAction',
  'resetURL',
  'url-updated',
  'endTest',
  'webview-load-finished',
  'webview-load-failed',
  'end-clicks',
  'end-screenshots',
  'screenshots-progress'
]
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  on: (channel, func) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args))
    }
  },
})
