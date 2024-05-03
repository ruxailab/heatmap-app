const { contextBridge, ipcRenderer } = require('electron')
// import { contextBridge, ipcRenderer } from 'electron'

// Expose a restricted subset of ipcRenderer to the renderer process
let validChannels = ['urlToGo']
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    // List of allowed channels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  // Add any other methods or channels you want to expose
})
