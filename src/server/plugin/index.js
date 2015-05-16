"use strict";

exports.startBridge = startBridge;

var flic = require("flic");

function startBridge() {
    var BridgeNode = flic.bridge;

    /*eslint-disable no-new */
    new BridgeNode();
    /*eslint-enable no-new */
}
