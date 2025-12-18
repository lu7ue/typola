const {app, BrowserWindow, ipcMain, Menu} = require("electron");
const path = require("path");

const {db, sqlite} = require("./src/backend/db/index.js");
const {runMigrations} = require("./src/backend/db/migrate.js");
const cardController = require("./src/backend/controllers/cardController.js");

let win;

function createWindow() {
    const isMac = process.platform === "darwin";

    win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: !isMac ? false : true,
        titleBarStyle: isMac ? "default" : undefined,
        webPreferences: {
            preload: path.join(__dirname, "src/backend/preload.js"),
        },
    });

    // Window controls handlers
    ipcMain.handle("win:minimize", () => win?.minimize());
    ipcMain.handle("win:maximize", () => {
        if (!win) return;
        win.isMaximized() ? win.unmaximize() : win.maximize();
        win.webContents.send("win:maximized-changed", win.isMaximized());
    });
    ipcMain.handle("win:close", () => win?.close());
    ipcMain.handle("win:isMaximized", () => win?.isMaximized() || false);

    win.on("maximize", () => win.webContents.send("win:maximized-changed", true));
    win.on("unmaximize", () =>
        win.webContents.send("win:maximized-changed", false)
    );

    Menu.setApplicationMenu(null);

    win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
    runMigrations();

    cardController.setDB(sqlite);

    ipcMain.handle("db:createSet", (event, set) =>
        cardController.createSet(set.title, set.description)
    );

    ipcMain.handle("db:createCard", (event, card) =>
        cardController.createCard(card)
    );

    ipcMain.handle("db:getAllSets", () =>
        cardController.getAllSets()
    );

    ipcMain.handle("db:getSetById", (event, id) =>
        cardController.getSetById(id)
    );

    ipcMain.handle("db:updateSetInfo", (event, payload) =>
        cardController.updateSetInfo(
            payload.id,
            payload.title,
            payload.description
        )
    );

    ipcMain.handle("db:updateSetLanguages", (event, payload) =>
        cardController.updateSetLanguages(
            payload.setId,
            payload.termLanguage,
            payload.definitionLanguage
        )
    );

    ipcMain.handle("db:updateCard", (e, card) =>
        cardController.updateCardById(card)
    );

    ipcMain.handle("db:deleteCards", (e, ids) =>
        cardController.deleteCardsByIds(ids)
    );

    ipcMain.handle("db:deleteSet", (e, id) =>
        cardController.deleteSetById(id)
    );

    createWindow();
});


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
