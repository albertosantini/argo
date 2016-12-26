"use strict";

exports.startBridge = startBridge;

const flic = require("flic");

function startBridge() {
    flic.createBridge();
}
