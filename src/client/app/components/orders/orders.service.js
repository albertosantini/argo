"use strict";

{
    angular
        .module("components.orders")
        .factory("ordersService", ordersService);

    ordersService.$inject = ["$http", "sessionService", "accountsService"];
    function ordersService($http, sessionService, accountsService) {
        const orders = [],
            service = {
                getOrders,
                closeOrder,
                putOrder,
                updateOrders,
                refresh
            };

        return service;

        function getOrders() {
            return orders;
        }

        function refresh() {
            sessionService.isLogged().then(credentials => {
                $http.post("/api/orders", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(res => {
                    orders.length = 0;
                    angular.extend(orders, res.data);
                });
            });
        }

        function putOrder(order) {
            return sessionService.isLogged().then(
                credentials => $http.post("/api/order", {
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
                }).then(trade => trade.data)
                .catch(err => err.data)
            );
        }

        function closeOrder(id) {
            return sessionService.isLogged().then(
                credentials => $http.post("/api/closeorder", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    id
                }).then(order => order.data)
                .catch(err => err.data)
            );
        }

        function updateOrders(tick) {
            const account = accountsService.getAccount(),
                pips = account.pips;

            orders.forEach((order, index) => {
                let current;

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

}
