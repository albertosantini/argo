"use strict";

(function () {
    angular
        .module("argo")
        .factory("chartsService", chartsService);

    chartsService.$inject = ["$http", "sessionService"];
    function chartsService($http, sessionService) {
        var quotes = {},
            service = {
                getHistQuotes: getHistQuotes,
                getQuotes: getQuotes,
                updateTick: updateTick
            };

        return service;

        function getHistQuotes(opt) {
            var session = sessionService.get(),
                instrument = opt.instrument || "EUR_USD",
                granularity = opt.granularity || "M5",
                count = opt.count,
                candleFormat = opt.candleFormat || "midpoint",
                alignmentTimezone = opt.alignmentTimezone || "America/New_York",
                dailyAlignment = opt.dailyAlignment || "0";

            $http.post("/api/candles", {
                environment: session.environment,
                accessToken: session.token,
                accountId: session.accountId,
                instrument: instrument,
                granularity: granularity,
                cound: count,
                candleFormat: candleFormat,
                alignmentTimezone: alignmentTimezone,
                dailyAlignment: dailyAlignment
            }).success(function (candles) {
                console.log(candles);
            });
        }

        function getQuotes() {
            return quotes;
        }

        function updateTick(tick) {
            var instrument = tick.instrument;

            quotes[instrument] = {
                time: tick.time,
                ask: tick.ask,
                bid: tick.bid
            };
        }
    }

}());
