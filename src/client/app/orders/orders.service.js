"use strict";

(function () {
    angular
        .module("argo")
        .factory("ordersService", ordersService);

    ordersService.$inject = ["$http", "$q", "sessionService"];
    function ordersService($http, $q, sessionService) {
        var orders = [],
            service = {
                getOrders: getOrders,
                closeOrder: closeOrder,
                putOrder: putOrder,
                updateOrders: updateOrders,
                refresh: refresh

            };

        return service;

        function getOrders() {
            return orders;
        }

        function refresh() {
            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/orders", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(function (res) {
                    orders.length = 0;
                    angular.extend(orders, res.data);
                });
            });
        }

        function putOrder(order) {
            var deferred = $q.defer();

            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/order", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    instrument: order.instrument,
                    units: order.units,
                    side: order.side,
                    type: order.type,
                    expiry: order.expiry,
                    price: order.price,
                    lowerBound: order.lowerBound,
                    upperBound: order.upperBound,
                    stopLoss: order.stopLoss,
                    takeProfit: order.takeProfit,
                    trailingStop: order.trailingStop
                }).then(function (trade) {
                    deferred.resolve(trade.data);
                });
            });

            return deferred.promise;
        }

        function closeOrder(id) {
            var deferred = $q.defer();

            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/closeorder", {
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

        function updateOrders(tick) {
            orders.forEach(function (order, index) {
                var current;

                if (order.instrument === tick.instrument) {

                    if (order.side === "buy") {
                        current = tick.bid;
                    }
                    if (order.side === "sell") {
                        current = tick.ask;
                    }

                    orders[index].current = current;
                    orders[index].distance = (Math.abs(current - order.price) /
                        getPips(current));
                }
            });
        }

        function getPips(n) {
            var decimals = n.toString().split("."),
                nDecimals = decimals[1].length,
                pips = 1 / Math.pow(10, nDecimals - 1);

            return pips;
        }

    }

}());
