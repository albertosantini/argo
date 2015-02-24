"use strict";

(function () {
    angular
        .module("argo")
        .factory("quotesService", quotesService);

    quotesService.$inject = [];
    function quotesService() {
        var quotes = {},
            service = {
                getQuotes: getQuotes,
                updateTick: updateTick
            };

        return service;

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
