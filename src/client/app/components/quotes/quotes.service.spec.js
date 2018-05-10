import { QuotesService } from "./quotes.service.js";
import { AccountsService } from "../account/accounts.service.js";

const assert = window.chai.assert;

describe("quotesService", () => {

    beforeEach(() => {
        AccountsService.account = {
            streamingInstruments: ["EUR_USD"],
            pips: {
                EUR_USD: 0.0001
            }
        };

        QuotesService.quotes = {
            EUR_USD: {}
        };
        QuotesService.updateTick({
            instrument: "EUR_USD",
            time: "2013-06-21T17:41:04.648747Z",
            ask: 1.31528,
            bid: 1.31513
        });
    });

    it("getQuotes", () => {
        const quotes = QuotesService.getQuotes(),
            eurusd = quotes.EUR_USD;

        assert.strictEqual("2013-06-21T17:41:04.648747Z", eurusd.time);
        assert.strictEqual(1.31528, eurusd.ask);
        assert.strictEqual(1.31513, eurusd.bid);
        assert.strictEqual("1.5", eurusd.spread);
    });

});
