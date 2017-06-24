import "mocha";
import { assert } from "chai";

import { OrdersService } from "./orders.service";
import { SessionService } from "../session/session.service";

const { beforeEach, describe, it } = window;

describe("ordersService", () => {
    const environment = "my environment";
    const token = "my token";
    const accountId = "my account id";
    const mockedOrders = [
        {
            id: 175427639,
            instrument: "EUR_USD",
            units: 20,
            side: "buy",
            type: "marketIfTouched",
            time: "2014-02-11T16:22:07Z",
            price: 1,
            takeProfit: 0,
            stopLoss: 0,
            expiry: "2014-02-15T16:22:07Z",
            upperBound: 0,
            lowerBound: 0,
            trailingStop: 0
        },
        {
            id: 175427637,
            instrument: "EUR_USD",
            units: 10,
            side: "sell",
            type: "marketIfTouched",
            time: "2014-02-11T16:22:07Z",
            price: 1,
            takeProfit: 0,
            stopLoss: 0,
            expiry: "2014-02-12T16:22:07Z",
            upperBound: 0,
            lowerBound: 0,
            trailingStop: 0
        }
    ];

    beforeEach(() => {
        const apiOrders = "/api/orders";

        /* eslint no-new:off */
        new OrdersService([]);

        SessionService.setCredentials({
            environment,
            token,
            accountId
        });

        fetch.mock(apiOrders, mockedOrders);
    });

    it("getOrders", done => {
        OrdersService.refresh().then(orders => {
            assert.lengthOf(orders, 2);

            assert.strictEqual(175427637, orders[1].id);
            assert.strictEqual("EUR_USD", orders[1].instrument);
            assert.strictEqual(10, orders[1].units);
            assert.strictEqual("sell", orders[1].side);
            assert.strictEqual("marketIfTouched", orders[1].type);
            assert.strictEqual("2014-02-11T16:22:07Z", orders[1].time);
            assert.strictEqual(1, orders[1].price);
            assert.strictEqual(0, orders[1].takeProfit);
            assert.strictEqual(0, orders[1].stopLoss);
            assert.strictEqual("2014-02-12T16:22:07Z", orders[1].expiry);
            assert.strictEqual(0, orders[1].takeProfit);
            assert.strictEqual(0, orders[1].upperBound);
            assert.strictEqual(0, orders[1].lowerBound);
            assert.strictEqual(0, orders[1].trailingStop);
        }).then(done).catch(done);
    });
});
