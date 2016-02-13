"use strict";

exports.shoutStreaming = shoutStreaming;
exports.getPlugins = getPlugins;
exports.engagePlugins = engagePlugins;

var util = require("util"),
    flic = require("flic"),
    async = require("async"),
    routes = require("../routes");

var nodeName = "master",
    plugins = {};

var masterNode = flic.createNode({
    id: nodeName,
    connect_callback: function (err) {
        if (!err) {
            util.log("Argo streaming node online");
        } else {
            util.log(err);
        }
    }
});

masterNode.on("argo.register", function (pluginName, done) {
    plugins[pluginName] = true;
    util.log("Argo plugin registered", pluginName);
    done(null, "http://localhost:" + routes.config.port);
    refreshPlugins();
});

masterNode.on("argo.unregister", function (pluginName, done) {
    delete plugins[pluginName];
    util.log("Argo plugin unregistered", pluginName);
    done();
    refreshPlugins();
});

masterNode.on("error", function (err) {
    util.log(err);
});

function enable(name, config, callback) {
    var event = name + ":argo.enable";

    masterNode.tell(event, name, config, function (err) {
        if (!err) {
            return callback();
        }
    });
}

function disable(name, callback) {
    var event = name + ":argo.disable";

    masterNode.tell(event, name, function (err) {
        if (!err) {
            return callback();
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
            return callback(err, res);
        }
    });
}

function engagePlugins(plugs, config) {
    var pluginNames = Object.keys(plugs),
        tellSeries = {};

    pluginNames.forEach(function (name) {
        tellSeries[name] = function (done) {
            if (plugs[name]) {
                enable(name, config, done);
            } else {
                disable(name, done);
            }
        };
    });

    async.series(tellSeries);
}

function refreshPlugins() {
    routes.stream.sendMessage(JSON.stringify({"refreshPlugins": true}));
}
