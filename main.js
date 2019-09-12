"use strict";

const { app, BrowserWindow, ipcMain: ipc } = require("electron");

const util = require("./src/server/util");
const config = require("./src/server/routes/config");

async function createWindow() {
    const mainWindow = new BrowserWindow({
        frame: false,
        height: 850,
        icon: "src/client/img/favicon.ico",
        show: false,
        width: 1450,
        webPreferences: {
            nodeIntegration: true
        }
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

    const ipaddress = await util.getIP();
    const port = config.port;
    const url = `http://${ipaddress}:${port}/${indexFile}`;

    mainWindow.loadURL(url);
}

require("./src/server/app");

app.on("ready", createWindow);
