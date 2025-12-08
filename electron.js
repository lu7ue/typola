const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Database = require("better-sqlite3");

let win;
let db;

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "src/backend/preload.js"),
        },
    });

    win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
    db = new Database(path.join(__dirname, "src/db.sqlite"));

    db.prepare(`
    CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY,
        text TEXT NOT NULL
    )
    `).run();

    createWindow();
});


ipcMain.handle("db:getAllWords", () => {
    const rows = db.prepare("SELECT * FROM words").all();
    return rows;
});

