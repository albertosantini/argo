import "mocha";
import { assert } from "chai";

import { TradesService } from "./trades.service";
import { SessionService } from "../session/session.service";

const { beforeEach, describe, it } = window;

describe("tradesService", () => {
    const environment = "my environment";
    const token = "my token";
    const accountId = "my account id";
    const mockedTrades = [
        {
            id: 175427743,
            units: 2,
            side: "sell",
            instrument: "EUR_USD",
            time: "2014-02-13T17:47:57Z",
            price: 1.36687,
            takeProfit: 0,
            stopLoss: 0,
            trailingStop: 0,
            trailingAmount: 0
        },
        {
            id: 175427742,
            units: 2,
            side: "sell",
            instrument: "EUR_USD",
            time: "2014-02-13T17:47:56Z",
            price: 1.36687,
            takeProfit: 0,
            stopLoss: 0,
            trailingStop: 0,
            trailingAmount: 0
        }
    ];


    beforeEach(() => {
        const apiTrades = "/api/trades";

        /* eslint no-new:off */
        new TradesService({ value: [] });

        SessionService.setCredentials({
            environment,
            token,
            accountId
        });

        fetch.mock(apiTrades, mockedTrades);
    });

    it("getTrades", done => {
        TradesService.refresh().then(trades => {
            assert.lengthOf(trades, 2);

            assert.strictEqual(175427743, trades[0].id);
            assert.strictEqual(2, trades[0].units);
            assert.strictEqual("sell", trades[0].side);
            assert.strictEqual("EUR_USD", trades[0].instrument);
            assert.strictEqual("2014-02-13T17:47:57Z", trades[0].time);
            assert.strictEqual(1.36687, trades[0].price);
            assert.strictEqual(0, trades[0].takeProfit);
            assert.strictEqual(0, trades[0].stopLoss);
            assert.strictEqual(0, trades[0].trailingStop);
            assert.strictEqual(0, trades[0].trailingAmount);
        }).then(done).catch(done);
    });
});
