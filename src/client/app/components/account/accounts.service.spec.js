import "mocha";
import { assert } from "chai";

import { AccountsService } from "./accounts.service";
import { SessionService } from "../session/session.service";

const { beforeEach, describe, it } = window;

describe("AccountsService", () => {
    const environment = "my environment";
    const token = "my token";
    const accountId = "my account id";

    beforeEach(() => {
        const apiAccount = "/api/account";
        const apiInstruments = "/api/instruments";

        AccountsService.account = {};

        SessionService.setCredentials({
            environment,
            token,
            accountId
        });

        fetch.mock(apiAccount, {
            account: {
                currency: "USD",
                accountId: 7442890,
                balance: 110410.5028,
                marginAvailable: 110394.9676,
                marginCallMarginUsed: 18.1671,
                realizedPL: -1983.78,
                unrealizedPL: 2.6319,
                instruments: ["EUR_USD"]
            }
        });

        fetch.mock(apiInstruments, [
            {
                displayName: "EUR/USD",
                name: "EUR_USD",
                maximumOrderUnits: "100000000",
                pipLocation: -4
            }
        ]);
    });

    it("getAccount", () => {
        const account = AccountsService.getAccount();

        assert.strictEqual(0, Object.keys(account).length);
    });

    it("getAccounts", done => {
        AccountsService.getAccounts({
            environment,
            token,
            accountId
        }).then(() => {
            const account = AccountsService.account;

            assert.strictEqual("USD", account.currency);
            assert.strictEqual(7442890, account.accountId);
            assert.strictEqual(110410.5028, account.balance);
            assert.strictEqual(110394.9676, account.marginAvailable);
            assert.strictEqual(18.1671, account.marginCallMarginUsed);
            assert.strictEqual(-1983.78, account.realizedPL);
            assert.strictEqual(2.6319, account.unrealizedPL);
            assert.strictEqual(true, account.timestamp !== null);
            assert.strictEqual(0.0023837406163863604, account.unrealizedPLPercent);
        }).then(done).catch(done);
    });
});
