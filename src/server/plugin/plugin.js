"use strict";

exports.shoutStreaming = shoutStreaming;
exports.getPlugins = getPlugins;
exports.engagePlugins = engagePlugins;

const util = require("util"),
    flic = require("flic"),
    async = require("async"),
    routes = require("../routes");

const nodeName = "master",
    plugins = {};

const masterNode = flic.createNode({
    id: nodeName,
    connect_callback(err) {
        if (!err) {
            util.log("Argo streaming node online");
        } else {
            util.log(err);
        }
    }
});

masterNode.on("argo.register", (pluginName, done) => {
    plugins[pluginName] = true;
    util.log("Argo plugin registered", pluginName);
    done(null, `http://localhost:${routes.config.port}`);
    refreshPlugins();
});

masterNode.on("argo.unregister", (pluginName, done) => {
    delete plugins[pluginName];
    util.log("Argo plugin unregistered", pluginName);
    done();
    refreshPlugins();
});

masterNode.on("error", err => {
    util.log(err);
});

function enable(name, config, callback) {
    const event = `${name}:argo.enable`;

    masterNode.tell(event, name, config, err => {
        if (err) {
            return callback(err);
        }
        return callback();
    });
}

function disable(name, callback) {
    const event = `${name}:argo.disable`;

    masterNode.tell(event, name, err => {
        if (err) {
            return callback(err);
        }
        return callback();
    });
}

function shoutStreaming(data) {
    masterNode.shout("argo.streaming", data);
}

function getPlugins(callback) {
    const pluginNames = Object.keys(plugins),
        tellSeries = {};

    pluginNames.forEach(name => {
        tellSeries[name] = done => {
            const event = `${name}:argo.status`;

            masterNode.tell(event, name, (err, status) => {
                if (!err) {
                    done(null, status);
                }
            });
        };
    });

    async.series(tellSeries, (err, res) => {
        if (err) {
            return callback(err);
        }
        return callback(err, res);
    });
}

function engagePlugins(plugs, config) {
    const pluginNames = Object.keys(plugs),
        tellSeries = {};

    pluginNames.forEach(name => {
        tellSeries[name] = done => {
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
    routes.stream.sendMessage(JSON.stringify({ refreshPlugins: true }));
}
