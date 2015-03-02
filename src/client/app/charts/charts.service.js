"use strict";

(function () {
    angular
        .module("argo")
        .factory("chartsService", chartsService);

    chartsService.$inject = ["$http", "$q", "sessionService"];
    function chartsService($http, $q, sessionService) {
        var service = {
                getHistQuotes: getHistQuotes
            };

        return service;

        function getHistQuotes(opt) {
            var deferred = $q.defer();

            sessionService.isLogged().then(function () {
                var credentials = sessionService.getCredentials(),
                    instrument = opt && opt.instrument || "EUR_USD",
                    granularity = opt && opt.granularity || "M5",
                    count = opt && opt.count || 251,
                    candleFormat = opt && opt.candleFormat || "midpoint",
                    alignmentTimezone = opt && opt.alignmentTimezone
                        || "America/New_York",
                    dailyAlignment = opt && opt.dailyAlignment || "0";

                $http.post("/api/candles", {
                    environment: credentials.environment,
                    token: credentials.token,
                    instrument: instrument,
                    granularity: granularity,
                    count: count,
                    candleFormat: candleFormat,
                    alignmentTimezone: alignmentTimezone,
                    dailyAlignment: dailyAlignment
                }).then(function (candles) {
                    deferred.resolve(candles);
                });
            });

            return deferred.promise;
        }

    }

}());
