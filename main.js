"use strict";

const { app, BrowserWindow, ipcMain: ipc } = require("electron");

function createWindow() {
    const mainWindow = new BrowserWindow({
        frame: false,
        height: 850,
        icon: "src/client/img/favicon.ico",
        show: false,
        width: 1450
    });

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    ipc.on("mocha-done", (event, count) => {
        mainWindow.webContents.once("destroyed", () => {
            app.exit(count);
        });

        mainWindow.close();
    });

    const indexFile = process.argv[2] || "index.html";
    const url = `http://localhost:8000/${indexFile}`;

    mainWindow.loadURL(url);
}

require("./src/server/app");

app.on("ready", createWindow);
