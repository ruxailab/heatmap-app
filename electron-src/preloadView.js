const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Not used right now
  sendClick: (x, y) => ipcRenderer.send('web-click', x, y),
})

