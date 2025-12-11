const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backend", {
  getAllWords: () => ipcRenderer.invoke("db:getAllWords"),
  minimize: () => ipcRenderer.invoke("win:minimize"),
  maximize: () => ipcRenderer.invoke("win:maximize"),
  close: () => ipcRenderer.invoke("win:close"),
});
