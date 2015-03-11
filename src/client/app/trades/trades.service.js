"use strict";

(function () {
    angular
        .module("argo")
        .factory("tradesService", tradesService);

    tradesService.$inject = ["$http", "$q", "sessionService"];
    function tradesService($http, $q, sessionService) {
        var service = {
            getTrades: getTrades,
            closeTrade: closeTrade
        };

        return service;

        function getTrades() {
            var deferred = $q.defer();

            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/trades", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(function (trades) {
                    deferred.resolve(trades.data);
                });
            });

            return deferred.promise;
        }

        function closeTrade(id) {
            var deferred = $q.defer();

            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/closetrade", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    id: id
                }).then(function (order) {
                    deferred.resolve(order.data);
                });
            });

            return deferred.promise;
        }

    }

}());
