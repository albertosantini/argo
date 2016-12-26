"use strict";


describe("quotesService", () => {
    let accountsService,
        quotesService;

    beforeEach(module("components.quotes"));

    beforeEach(() => {
        accountsService = {
            getAccount() {
                return {
                    streamingInstruments: ["EUR_USD"],
                    pips: {
                        EUR_USD: 0.0001
                    }
                };
            }
        };

        module($provide => {
            $provide.value("accountsService", accountsService);
        });
    });

    beforeEach(inject($injector => {
        quotesService = $injector.get("quotesService");

        quotesService.updateTick({
            instrument: "EUR_USD",
            time: "2013-06-21T17:41:04.648747Z",
            ask: 1.31528,
            bid: 1.31513
        });
    }));

    describe("getQuotes", () => {
        it("test", () => {
            const quotes = quotesService.getQuotes(),
                eurusd = quotes.EUR_USD;

            assert.equal("2013-06-21T17:41:04.648747Z", eurusd.time);
            assert.equal(1.31528, eurusd.ask);
            assert.equal(1.31513, eurusd.bid);
            assert.equal(1.5, eurusd.spread);
        });
    });
});
