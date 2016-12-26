"use strict";

describe("accountsService", () => {
    const api = "/api/account",
        apiInstruments = "/api/instruments";

    let $httpBackend,
        sessionService,
        accountsService;

    beforeEach(module("components"));

    beforeEach(inject($injector => {
        const environment = "my environment",
            token = "my token",
            accountId = "my account id";

        $httpBackend = $injector.get("$httpBackend");
        accountsService = $injector.get("accountsService");
        sessionService = $injector.get("sessionService");

        sessionService.setCredentials({
            environment,
            token,
            accountId
        });

        $httpBackend
            .when("POST", api)
            .respond({
                account: {
                    currency: "USD",
                    accountId: 7442890,
                    balance: 110410.5028,
                    marginAvailable: 110394.9676,
                    marginCallMarginUsed: 18.1671,
                    realizedPL: -1983.78,
                    unrealizedPL: 2.6319
                }
            });

        $httpBackend
            .when("POST", apiInstruments)
            .respond([
                {
                    displayName: "EUR/USD",
                    name: "EUR_USD",
                    maximumOrderUnits: "100000000",
                    pipLocation: -4
                }
            ]);

        $httpBackend.whenGET(/^app\/.*\.html$/).respond(200);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("getAccounts", () => {
        it("test", () => {
            accountsService.getAccounts({
                environment: "my environment",
                token: "my token",
                accountId: "my account id"
            }).then(() => {
                const account = accountsService.getAccount();

                assert.equal("USD", account.currency);
                assert.equal("7442890", account.accountId);
                assert.equal(110410.5028, account.balance);
                assert.equal(110394.9676, account.marginAvailable);
                assert.equal(18.1671, account.marginCallMarginUsed);
                assert.equal(-1983.78, account.realizedPL);
                assert.equal(2.6319, account.unrealizedPL);
                assert.isDefined(account.timestamp);
                assert.equal(0.0023837406163863604, account.unrealizedPLPercent);
            });
            $httpBackend.flush();
        });
    });
});
