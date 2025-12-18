const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("backend", {
    createSet: (set) => ipcRenderer.invoke("db:createSet", set),
    createCard: (card) => ipcRenderer.invoke("db:createCard", card),
    getAllSets: () => ipcRenderer.invoke("db:getAllSets"),
    getSetById: (id) => ipcRenderer.invoke("db:getSetById", id),
    updateSetInfo: (payload) =>
        ipcRenderer.invoke("db:updateSetInfo", payload),

    updateSetLanguages: (payload) =>
        ipcRenderer.invoke("db:updateSetLanguages", payload),

    updateCard: (card) => ipcRenderer.invoke("db:updateCard", card),
    deleteCards: (ids) => ipcRenderer.invoke("db:deleteCards", ids),

    platform: process.platform,
    minimize: () => ipcRenderer.invoke("win:minimize"),
    maximize: () => ipcRenderer.invoke("win:maximize"),
    close: () => ipcRenderer.invoke("win:close"),

    getIsMaximized: () => ipcRenderer.invoke("win:isMaximized"),
    onMaximizedChanged: (callback) => {
        const handler = (_event, isMaximized) => callback(isMaximized);
        ipcRenderer.on("win:maximized-changed", handler);
        return () => ipcRenderer.removeListener("win:maximized-changed", handler);
    },
});