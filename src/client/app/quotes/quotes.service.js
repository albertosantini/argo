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
                streamingInstruments = account.streamingInstruments,
                pips = account.pips,
                instrument = tick.instrument;

            quotes[instrument] = {
                time: tick.time,
                ask: tick.ask,
                bid: tick.bid,
                spread: ((tick.ask - tick.bid) / pips[instrument]).toFixed(1)
            };

            orderByInstrument(streamingInstruments);
        }

        function reset() {
            var key;

            for (key in quotes) {
                if (quotes.hasOwnProperty(key)) {
                    delete quotes[key];
                }
            }
        }

        function orderByInstrument(streamingInstruments) {
            if (!angular.equals(streamingInstruments, Object.keys(quotes))) {
                streamingInstruments.forEach(function (key) {
                    var tempKey = key + "__tmp";

                    renameKey(quotes, key, tempKey);
                    renameKey(quotes, tempKey, key);
                });
            }
        }

        function renameKey(o, oldKey, newKey) {
            if (oldKey !== newKey) {
                Object.defineProperty(o, newKey,
                    Object.getOwnPropertyDescriptor(o, oldKey));
                delete o[oldKey];
            }
        }
    }

}());
