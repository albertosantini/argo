"use strict";

(function () {
    angular
        .module("argo")
        .factory("chartsService", chartsService);

    chartsService.$inject = ["$http", "sessionService"];
    function chartsService($http, sessionService) {
        var service = {
                getHistQuotes: getHistQuotes
            };

        return service;

        function getHistQuotes(opt) {
            var instrument = opt && opt.instrument || "EUR_USD",
                granularity = opt && opt.granularity || "M5",
                count = opt && opt.count || 251,
                candleFormat = opt && opt.candleFormat || "midpoint",
                alignmentTimezone = opt && opt.alignmentTimezone
                    || "America/New_York",
                dailyAlignment = opt && opt.dailyAlignment || "0";

            return $http.post("/api/candles", {
                environment: sessionService.environment,
                token: sessionService.token,
                instrument: instrument,
                granularity: granularity,
                count: count,
                candleFormat: candleFormat,
                alignmentTimezone: alignmentTimezone,
                dailyAlignment: dailyAlignment
            });
        }

    }

}());
