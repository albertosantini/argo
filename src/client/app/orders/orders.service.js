"use strict";

(function () {
    angular
        .module("argo")
        .factory("ordersService", ordersService);

    ordersService.$inject = ["$http", "$q", "sessionService"];
    function ordersService($http, $q, sessionService) {
        var service = {
            getOrders: getOrders
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

    }

}());
