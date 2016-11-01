"use strict";

(function () {
    angular
        .module("argo")
        .factory("ordersService", ordersService);

    ordersService.$inject = ["$http", "$q",
        "sessionService", "accountsService"];
    function ordersService($http, $q, sessionService, accountsService) {
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
                    priceBound: order.lowerBound || order.upperBound,
                    stopLossOnFill: order.stopLossOnFill,
                    takeProfitOnFill: order.takeProfitOnFill,
                    trailingStopLossOnFill: order.trailingStopLossOnFill
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
            var account = accountsService.getAccount(),
                pips = account.pips;

            orders.forEach(function (order, index) {
                var current;

                if (order.instrument === tick.instrument) {

                    if (order.side === "buy") {
                        current = tick.ask;
                    }
                    if (order.side === "sell") {
                        current = tick.bid;
                    }

                    orders[index].current = current;
                    orders[index].distance = (Math.abs(current - order.price) /
                        pips[order.instrument]);
                }
            });
        }

    }

}());
