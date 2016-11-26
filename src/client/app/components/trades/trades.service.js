"use strict";

(function () {
    angular
        .module("components.trades")
        .factory("tradesService", tradesService);

    tradesService.$inject = ["$http", "$q",
        "sessionService", "accountsService"];
    function tradesService($http, $q, sessionService, accountsService) {
        var trades = [],
            service = {
                getTrades: getTrades,
                closeTrade: closeTrade,
                updateTrades: updateTrades,
                refresh: refresh
            };

        return service;

        function getTrades() {
            return trades;
        }

        function refresh() {
            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/trades", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(function (res) {
                    trades.length = 0;
                    angular.extend(trades, res.data);
                    trades.forEach(function (trade) {
                        trade.side = trade.currentUnits > 0 ? "buy" : "sell";
                    });
                });
            });
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
                    if (order.data.code) {
                        deferred.reject(order.data);
                    } else {
                        deferred.resolve(order.data);
                    }
                }, function (err) {
                    deferred.reject(err.data);
                });
            });

            return deferred.promise;
        }

        function updateTrades(tick) {
            var account = accountsService.getAccount(),
                pips = account.pips;

            trades.forEach(function (trade, index) {
                var current,
                    side;

                if (trade.instrument === tick.instrument) {
                    side = trade.currentUnits > 0 ? "buy" : "sell";

                    if (side === "buy") {
                        current = tick.bid;
                        trades[index].profitPips =
                            ((current - trade.price) / pips[trade.instrument]);
                    }
                    if (side === "sell") {
                        current = tick.ask;
                        trades[index].profitPips =
                            ((trade.price - current) / pips[trade.instrument]);
                    }

                    trades[index].current = current;
                }
            });
        }

    }

}());
