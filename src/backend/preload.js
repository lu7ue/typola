const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backend", {
  getAllWords: () => ipcRenderer.invoke("db:getAllWords"),
  createSet: (set) => ipcRenderer.invoke("db:createSet", set),
  createCard: (card) => ipcRenderer.invoke("db:createCard", card),
  minimize: () => ipcRenderer.invoke("win:minimize"),
  maximize: () => ipcRenderer.invoke("win:maximize"),
  close: () => ipcRenderer.invoke("win:close"),
});
