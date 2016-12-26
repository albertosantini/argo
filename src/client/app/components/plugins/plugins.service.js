"use strict";

{
    angular
        .module("components.plugins")
        .factory("pluginsService", pluginsService);

    pluginsService.$inject = ["$http", "sessionService", "accountsService"];
    function pluginsService($http, sessionService, accountsService) {
        const plugins = {},
            pluginsInfo = {
                count: 0
            },
            service = {
                getPlugins,
                getPluginsInfo,
                engagePlugins,
                refresh
            };

        return service;

        function getPlugins() {
            return plugins;
        }

        function getPluginsInfo() {
            return pluginsInfo;
        }

        function refresh() {
            sessionService.isLogged().then(credentials => {
                $http.post("/api/plugins", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(res => {
                    let name;

                    for (name in plugins) {
                        if (plugins.hasOwnProperty(name)) {
                            delete plugins[name];
                        }
                    }
                    angular.extend(plugins, res.data);
                    pluginsInfo.count = Object.keys(plugins).length;

                    Object.keys(plugins).forEach(key => {
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
            sessionService.isLogged().then(credentials => {
                const account = accountsService.getAccount();

                $http.post("/api/engageplugins", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    plugins: plugs,
                    config: {
                        pips: account.pips
                    }
                });
            });
        }

    }

}
