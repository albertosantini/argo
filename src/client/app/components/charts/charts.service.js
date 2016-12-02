"use strict";

(function () {
    angular
        .module("components.charts")
        .factory("chartsService", chartsService);

    chartsService.$inject = ["$http", "sessionService"];
    function chartsService($http, sessionService) {
        var service = {
            getHistQuotes: getHistQuotes
        };

        return service;

        function getHistQuotes(opt) {
            return sessionService.isLogged().then(function (credentials) {
                var instrument = opt && opt.instrument || "EUR_USD",
                    granularity = opt && opt.granularity || "M5",
                    count = opt && opt.count || 251,
                    alignmentTimezone = opt && opt.alignmentTimezone
                        || "America/New_York",
                    dailyAlignment = opt && opt.dailyAlignment || "0";

                return $http.post("/api/candles", {
                    environment: credentials.environment,
                    token: credentials.token,
                    instrument: instrument,
                    granularity: granularity,
                    count: count,
                    alignmentTimezone: alignmentTimezone,
                    dailyAlignment: dailyAlignment
                }).then(function (candles) {
                    return candles.data;
                }).catch(function (err) {
                    return err.data;
                });
            });
        }

    }

}());
