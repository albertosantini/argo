"use strict";

exports.start = start;
exports.stop = stop;
exports.shoutStreaming = shoutStreaming;
exports.getPluginNames = getPluginNames;

var util = require("util"),
    flic = require("flic");

var FlicNode = flic.node,
    nodeName = "master",
    plugins = {};

var masterNode = new FlicNode(nodeName, function (err) {
    if (!err) {
        util.log("Argo streaming node online");
    } else {
        util.log(err);
    }
});

masterNode.on("argo.register", function (pluginName, done) {
    plugins[pluginName] = true;
    util.log("Argo plugin registered", pluginName);
    done();
});

masterNode.on("argo.unregister", function (pluginName, done) {
    delete plugins[pluginName];
    util.log("Argo plugin unregistered", pluginName);
    done();
});

masterNode.on("error", function (err) {
    util.log(err);
});

function start(name) {
    masterNode.tell(name + ":argo.start");
}

function stop(name) {
    masterNode.tell(name + ":argo.stop");
}

function shoutStreaming(data) {
    masterNode.shout("argo.streaming", data);
}

function getPluginNames() {
    return Object.keys(plugins);
}
