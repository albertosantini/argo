"use strict";

(function () {
    angular
        .module("argo")
        .factory("tradesService", tradesService);

    tradesService.$inject = ["$http", "$q", "sessionService"];
    function tradesService($http, $q, sessionService) {
        var trades = [],
            service = {
                getTrades: getTrades,
                closeTrade: closeTrade,
                updateTrades: updateTrades
            };

        return service;

        function getTrades() {
            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/trades", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(function (res) {
                    trades.length = 0;
                    angular.extend(trades, res.data);
                });
            });

            return trades;
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

        function updateTrades(tick) {
            trades.forEach(function (trade, index) {
                var current;

                if (trade.instrument === tick.instrument) {

                    if (trade.side === "buy") {
                        current = tick.bid;
                    }
                    if (trade.side === "sell") {
                        current = tick.ask;
                    }

                    trades[index].current = current;
                }
            });
        }

    }

}());
