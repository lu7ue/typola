const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("backend", {
    getAllWords: () => ipcRenderer.invoke("db:getAllWords"),
});
