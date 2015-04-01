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
                updateTick: updateTick
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
    }

}());
