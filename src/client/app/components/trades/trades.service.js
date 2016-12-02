"use strict";

(function () {
    angular
        .module("components.trades")
        .factory("tradesService", tradesService);

    tradesService.$inject = ["$http", "sessionService", "accountsService"];
    function tradesService($http, sessionService, accountsService) {
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
            return sessionService.isLogged().then(function (credentials) {
                return $http.post("/api/closetrade", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    id: id
                }).then(function (order) {
                    return order.data;
                }).catch(function (err) {
                    return err.data;
                });
            });
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
