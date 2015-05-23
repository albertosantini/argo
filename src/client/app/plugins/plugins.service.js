"use strict";

(function () {
    angular
        .module("argo")
        .factory("pluginsService", pluginsService);

    pluginsService.$inject = ["$http", "sessionService"];
    function pluginsService($http, sessionService) {
        var plugins = {},
            pluginsInfo = {
                count: 0
            },
            service = {
                getPlugins: getPlugins,
                getPluginsInfo: getPluginsInfo,
                engagePlugins: engagePlugins,
                refresh: refresh
            };

        return service;

        function getPlugins() {
            return plugins;
        }

        function getPluginsInfo() {
            return pluginsInfo;
        }

        function refresh() {
            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/plugins", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(function (res) {
                    var name;

                    for (name in plugins) {
                        if (plugins.hasOwnProperty(name)) {
                            delete plugins[name];
                        }
                    }
                    angular.extend(plugins, res.data);
                    pluginsInfo.count = Object.keys(plugins).length;

                    Object.keys(plugins).forEach(function (key) {
                        if (plugins[key] === "enabled") {
                            plugins[key] = true;
                        } else {
                            plugins[key] = false;
                        }
                    });
                });
            });
        }

        function engagePlugins(plugs) {
            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/engageplugins", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    plugins: plugs
                });
            });
        }

    }

}());
