"use strict";

(function () {
    angular
        .module("argo")
        .factory("positionsService", positionsService);

    positionsService.$inject = ["$http", "$q", "sessionService"];
    function positionsService($http, $q, sessionService) {
        var service = {
            getPositions: getPositions
        };

        return service;

        function getPositions() {
            var deferred = $q.defer();

            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/positions", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(function (positions) {
                    deferred.resolve(positions.data);
                });
            });

            return deferred.promise;
        }

    }

}());
