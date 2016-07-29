"use strict";

var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        frame: false,
        height: 800,
        icon: "src/client/favicon.ico",
        width: 1450,
        webPreferences: {
            nodeIntegration: false
        }
    });

    mainWindow.loadURL("http://localhost:8000");

    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}

require("./src/server/app");

app.on("ready", createWindow);
