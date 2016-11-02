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
                    var data = [];

                    positions.data.forEach(function (position) {
                        var side,
                            longUnits,
                            shortUnits,
                            units,
                            avgPrice;

                        longUnits = position.long &&
                            parseInt(position.long.units, 10);
                        shortUnits = position.short &&
                            parseInt(position.short.units, 10);
                        units = longUnits || shortUnits;
                        side = units > 0 ? "buy" : "sell";
                        avgPrice = (longUnits && position.long.averagePrice)
                             || (shortUnits && position.short.averagePrice);

                        data.push({
                            side: side,
                            instrument: position.instrument,
                            units: units,
                            avgPrice: avgPrice
                        });
                    });
                    deferred.resolve(data);
                });
            });

            return deferred.promise;
        }

    }

}());
