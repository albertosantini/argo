"use strict";

var app = require("app");
var BrowserWindow = require("browser-window");

var mainWindow = null;

require("./src/server/app");

app.on("ready", function () {
    mainWindow = new BrowserWindow({
        frame: false,
        height: 800,
        width: 1400
    });

    mainWindow.loadURL("http://localhost:8000");
});
