"use strict";

{
    angular
        .module("components.trades")
        .factory("tradesService", tradesService);

    tradesService.$inject = ["$http", "sessionService", "accountsService"];
    function tradesService($http, sessionService, accountsService) {
        const trades = [],
            service = {
                getTrades,
                closeTrade,
                updateTrades,
                refresh
            };

        return service;

        function getTrades() {
            return trades;
        }

        function refresh() {
            sessionService.isLogged().then(credentials => {
                $http.post("/api/trades", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(res => {
                    trades.length = 0;
                    angular.extend(trades, res.data);
                    trades.forEach(trade => {
                        trade.side = trade.currentUnits > 0 ? "buy" : "sell";
                    });
                });
            });
        }

        function closeTrade(id) {
            return sessionService.isLogged().then(
                credentials => $http.post("/api/closetrade", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    id
                }).then(order => order.data)
                .catch(err => err.data)
            );
        }

        function updateTrades(tick) {
            const account = accountsService.getAccount(),
                pips = account.pips;

            trades.forEach((trade, index) => {
                let current,
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

}
