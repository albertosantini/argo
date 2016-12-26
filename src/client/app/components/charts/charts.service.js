"use strict";

{
    angular
        .module("components.charts")
        .factory("chartsService", chartsService);

    chartsService.$inject = ["$http", "sessionService"];
    function chartsService($http, sessionService) {
        const service = {
            getHistQuotes
        };

        return service;

        function getHistQuotes(opt) {
            return sessionService.isLogged().then(credentials => {
                const instrument = opt && opt.instrument || "EUR_USD",
                    granularity = opt && opt.granularity || "M5",
                    count = opt && opt.count || 251,
                    alignmentTimezone = opt && opt.alignmentTimezone
                        || "America/New_York",
                    dailyAlignment = opt && opt.dailyAlignment || "0";

                return $http.post("/api/candles", {
                    environment: credentials.environment,
                    token: credentials.token,
                    instrument,
                    granularity,
                    count,
                    alignmentTimezone,
                    dailyAlignment
                }).then(candles => candles.data)
                .catch(err => err.data);
            });
        }

    }

}
