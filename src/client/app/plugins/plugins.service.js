"use strict";

(function () {
    angular
        .module("argo")
        .factory("pluginsService", pluginsService);

    pluginsService.$inject = ["$http", "$q", "sessionService"];
    function pluginsService($http, $q, sessionService) {
        var plugins = [],
            service = {
                getPlugins: getPlugins,
                engagePlugins: engagePlugins
            };

        return service;

        function getPlugins() {
            var deferred = $q.defer();

            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/plugins", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(function (plugs) {
                    var pluginsKeys;

                    plugins = plugs.data;
                    pluginsKeys = Object.keys(plugins);

                    pluginsKeys.forEach(function (key) {
                        if (plugins[key] === "enabled") {
                            plugins[key] = true;
                        } else {
                            plugins[key] = false;
                        }
                    });

                    deferred.resolve(plugins);
                });
            });

            return deferred.promise;
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
