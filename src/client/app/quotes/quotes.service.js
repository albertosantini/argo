"use strict";

(function () {
    angular
        .module("argo")
        .factory("quotesService", quotesService);

    quotesService.$inject = ["accountsService"];
    function quotesService(accountsService) {
        var quotes = {},
            service = {
                getQuotes: getQuotes,
                updateTick: updateTick,
                reset: reset
            };

        return service;

        function getQuotes() {
            return quotes;
        }

        function updateTick(tick) {
            var account = accountsService.getAccount(),
                pips = account.pips,
                instrument = tick.instrument;

            quotes[instrument] = {
                time: tick.time,
                ask: tick.ask,
                bid: tick.bid,
                spread: ((tick.ask - tick.bid) / pips[instrument]).toFixed(1)
            };
        }

        function reset() {
            var key;

            for (key in quotes) {
                if (quotes.hasOwnProperty(key)) {
                    delete quotes[key];
                }
            }
        }
    }

}());
