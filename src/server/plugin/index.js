"use strict";

exports.startBridge = startBridge;

var flic = require("flic");

var BridgeNode = flic.bridge;

function startBridge() {
    /*eslint-disable no-new */
    new BridgeNode();
    /*eslint-enable no-new */
}

