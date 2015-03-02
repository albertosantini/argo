"use strict";

(function () {
    angular
        .module("argo")
        .factory("tradesService", tradesService);

    tradesService.$inject = ["$http", "$q", "sessionService"];
    function tradesService($http, $q, sessionService) {
        var service = {
            getTrades: getTrades
        };

        return service;

        function getTrades() {
            var deferred = $q.defer();

            sessionService.isLogged().then(function () {
                var credentials = sessionService.getCredentials();

                $http.post("/api/trades", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(function (trades) {
                    deferred.resolve(trades);
                });
            });

            return deferred.promise;
        }

    }

}());
