"use strict";

(function () {
    angular
        .module("argo")
        .factory("ordersService", ordersService);

    ordersService.$inject = ["$http", "$q", "sessionService"];
    function ordersService($http, $q, sessionService) {
        var service = {
            getOrders: getOrders,
            putOrder: putOrder
        };

        return service;

        function getOrders() {
            var deferred = $q.defer();

            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/orders", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(function (orders) {
                    deferred.resolve(orders.data);
                });
            });

            return deferred.promise;
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

    }

}());
