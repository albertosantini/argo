"use strict";

exports.shoutStreaming = shoutStreaming;
exports.getPlugins = getPlugins;
exports.engagePlugins = engagePlugins;

var util = require("util"),
    flic = require("flic"),
    async = require("async"),
    routes = require("../routes");

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
    done(null, "http://localhost:" + routes.config.port);
});

masterNode.on("argo.unregister", function (pluginName, done) {
    delete plugins[pluginName];
    util.log("Argo plugin unregistered", pluginName);
    done();
});

masterNode.on("error", function (err) {
    util.log(err);
});

function enable(name, callback) {
    var event = name + ":argo.enable";

    masterNode.tell(event, name, function (err) {
        if (!err) {
            callback();
        }
    });
}

function disable(name, callback) {
    var event = name + ":argo.disable";

    masterNode.tell(event, name, function (err) {
        if (!err) {
            callback();
        }
    });
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

function engagePlugins(plugs) {
    var pluginNames = Object.keys(plugs),
        tellSeries = {};

    pluginNames.forEach(function (name) {
        tellSeries[name] = function (done) {
            if (plugs[name]) {
                enable(name, done);
            } else {
                disable(name, done);
            }
        };
    });

    async.series(tellSeries);
}
