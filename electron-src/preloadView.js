const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  sendClick: (x, y) => ipcRenderer.send('click', x, y),
})
