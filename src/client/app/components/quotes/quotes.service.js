"use strict";

{
    angular
        .module("components.quotes")
        .factory("quotesService", quotesService);

    quotesService.$inject = ["accountsService"];
    function quotesService(accountsService) {
        const quotes = {},
            service = {
                getQuotes,
                updateTick,
                reset
            };

        return service;

        function getQuotes() {
            return quotes;
        }

        function updateTick(tick) {
            const account = accountsService.getAccount(),
                streamingInstruments = account.streamingInstruments,
                pips = account.pips,
                instrument = tick.instrument;

            quotes[instrument] = {
                time: tick.time,
                ask: tick.ask,
                bid: tick.bid,
                spread: ((tick.ask - tick.bid) / pips[instrument]).toFixed(1)
            };


            if (!angular.equals(streamingInstruments, Object.keys(quotes))) {
                streamingInstruments.forEach(instr => {
                    let temp;

                    if (quotes.hasOwnProperty(instr)) {
                        temp = quotes[instr];
                        delete quotes[instr];
                        quotes[instr] = temp;
                    }
                });
            }
        }

        function reset() {
            let key;

            for (key in quotes) {
                if (quotes.hasOwnProperty(key)) {
                    delete quotes[key];
                }
            }
        }

    }

}
