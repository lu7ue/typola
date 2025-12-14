const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const Database = require("better-sqlite3");
const cardController = require("./src/backend/controllers/cardController");

let win;
let db;

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
  db = new Database(path.join(__dirname, "src/db.sqlite"));

  cardController.setDB(db);

  db.prepare(`DROP TABLE IF EXISTS cards`).run();
  db.prepare(`DROP TABLE IF EXISTS sets`).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT
    )
  `
  ).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      set_id INTEGER NOT NULL,
      term TEXT NOT NULL,
      definition TEXT NOT NULL,
      term_language TEXT NOT NULL,
      definition_language TEXT NOT NULL,
      image TEXT,
      FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE
    )
  `
  ).run();

  // ipcMain handle
  ipcMain.handle("db:createSet", (event, set) =>
    cardController.createSet(set.title, set.description)
  );

  ipcMain.handle("db:createCard", (event, card) =>
    cardController.createCard(card)
  );

  ipcMain.handle("db:getAllWords", () => {
    const rows = db.prepare("SELECT * FROM words").all();
    return rows;
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
