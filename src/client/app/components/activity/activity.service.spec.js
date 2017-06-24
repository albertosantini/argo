import "mocha";
import { assert, expect } from "chai";

import { ActivityService } from "./activity.service";
import { SessionService } from "../session/session.service";
import { AccountsService } from "../account/accounts.service";

const { beforeEach, describe, it } = window;

describe("ActivityService", () => {
    const environment = "my environment";
    const token = "my token";
    const accountId = "my account id";
    const activity = {
        id: 176403879,
        accountId: 6765103,
        time: "2014-04-07T18:31:05Z",
        type: "MARKET_ORDER_CREATE",
        instrument: "EUR_USD",
        units: 2,
        side: "buy",
        price: 1.25325,
        pl: 0,
        interest: 0,
        accountBalance: 100000,
        tradeOpened: {
            id: 176403879,
            units: 2
        }
    };

    beforeEach(() => {
        const apiTransactions = "/api/transactions";

        /* eslint no-new:off */
        new ActivityService([]);

        SessionService.setCredentials({
            environment,
            token,
            accountId
        });

        AccountsService.account = {
            lastTransactionID: 123,
            streamingInstruments: ["EUR_USD"],
            pips: {
                EUR_USD: 0.0001
            }
        };

        fetch.mock(apiTransactions, [activity]);
    });

    it("getActivities", done => {
        ActivityService.refresh().then(activities => {
            assert.lengthOf(activities, 1);

            assert.strictEqual(176403879, activities[0].id);
            assert.strictEqual("MARKET_ORDER_CREATE", activities[0].type);
            assert.strictEqual("EUR_USD", activities[0].instrument);
            assert.strictEqual(2, activities[0].units);
            assert.strictEqual(1.25325, activities[0].price);
            assert.strictEqual(0, activities[0].interest);
            assert.strictEqual(0, activities[0].pl);
            assert.strictEqual(100000, activities[0].accountBalance);
            assert.strictEqual("2014-04-07T18:31:05Z", activities[0].time);
        }).then(done).catch(done);
    });

    it("addActivity", () => {
        expect(() => {
            ActivityService.addActivity(activity);
        }).to.not.throw(TypeError);
    });
});
