const { contextBridge, ipcRenderer } = require('electron')
// import { contextBridge, ipcRenderer } from 'electron'

// Expose a restricted subset of ipcRenderer to the renderer process
let validChannels = ['urlToGo', 'backAction', 'forwardAction']
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
})
