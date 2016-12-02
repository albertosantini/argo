"use strict";

(function () {
    angular
        .module("components.positions")
        .factory("positionsService", positionsService);

    positionsService.$inject = ["$http", "sessionService"];
    function positionsService($http, sessionService) {
        var service = {
            getPositions: getPositions
        };

        return service;

        function getPositions() {
            return sessionService.isLogged().then(function (credentials) {
                return $http.post("/api/positions", {
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

                    return data;
                }).catch(function (err) {
                    return err.data;
                });
            });
        }

    }

}());
