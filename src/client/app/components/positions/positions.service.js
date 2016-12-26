"use strict";

{
    angular
        .module("components.positions")
        .factory("positionsService", positionsService);

    positionsService.$inject = ["$http", "sessionService"];
    function positionsService($http, sessionService) {
        const service = {
            getPositions
        };

        return service;

        function getPositions() {
            return sessionService.isLogged().then(
                credentials => $http.post("/api/positions", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(positions => {
                    const data = [];

                    positions.data.forEach(position => {
                        const longUnits = position.long &&
                            parseInt(position.long.units, 10);
                        const shortUnits = position.short &&
                            parseInt(position.short.units, 10);
                        const units = longUnits || shortUnits;
                        const side = units > 0 ? "buy" : "sell";
                        const avgPrice = (longUnits && position.long.averagePrice)
                             || (shortUnits && position.short.averagePrice);

                        data.push({
                            side,
                            instrument: position.instrument,
                            units,
                            avgPrice
                        });
                    });

                    return data;
                }).catch(err => err.data)
            );
        }

    }

}
