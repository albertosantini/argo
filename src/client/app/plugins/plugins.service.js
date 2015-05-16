"use strict";

(function () {
    angular
        .module("argo")
        .factory("pluginsService", pluginsService);

    pluginsService.$inject = ["$http", "$q", "sessionService"];
    function pluginsService($http, $q, sessionService) {
        var plugins = [],
            service = {
                getPlugins: getPlugins
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
                    plugins = plugs.data;
                    deferred.resolve(plugins);
                });
            });

            return deferred.promise;
        }

    }

}());
