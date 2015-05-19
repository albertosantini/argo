"use strict";

exports.enable = enable;
exports.disable = disable;
exports.shoutStreaming = shoutStreaming;
exports.getPlugins = getPlugins;

var util = require("util"),
    flic = require("flic"),
    async = require("async");

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

function enable(name) {
    masterNode.tell(name + ":argo.enable");
}

function disable(name) {
    masterNode.tell(name + ":argo.disable");
}

function shoutStreaming(data) {
    masterNode.shout("argo.streaming", data);
}

function getPlugins(callback) {
    var pluginNames = Object.keys(plugins),
        tellSeries = {};

    pluginNames.forEach(function (name) {
        tellSeries[name] = function (done) {
            var event = name + ":argo.status";
            masterNode.tell(event, name, function (err, status) {
                if (!err) {
                    done(null, status);
                }
            });
        };
    });

    async.series(tellSeries, function (err, res) {
        if (!err) {
            callback(err, res);
        }
    });
}
