"use strict";

(function () {
    angular
        .module("components.orders")
        .factory("ordersService", ordersService);

    ordersService.$inject = ["$http", "sessionService", "accountsService"];
    function ordersService($http, sessionService, accountsService) {
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
            return sessionService.isLogged().then(function (credentials) {
                return $http.post("/api/order", {
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
                    return trade.data;
                }).catch(function (err) {
                    return err.data;
                });
            });
        }

        function closeOrder(id) {
            return sessionService.isLogged().then(function (credentials) {
                return $http.post("/api/closeorder", {
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

        function updateOrders(tick) {
            var account = accountsService.getAccount(),
                pips = account.pips;

            orders.forEach(function (order, index) {
                var current;

                if (order.instrument === tick.instrument) {

                    if (order.units > 0) {
                        current = tick.ask;
                    }
                    if (order.units < 0) {
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
