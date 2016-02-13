"use strict";

exports.startBridge = startBridge;

var flic = require("flic");

function startBridge() {
    flic.createBridge();
}
