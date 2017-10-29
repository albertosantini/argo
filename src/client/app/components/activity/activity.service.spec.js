/* eslint-env mocha */
/* global assert, expect, inject */

describe("activityService", () => {
    const api = "/api/transactions";
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


    let $httpBackend,
        sessionService,
        activityService;

    beforeEach(module("components"));

    beforeEach(inject($injector => {
        const environment = "my environment",
            token = "my token",
            accountId = "my account id";

        $httpBackend = $injector.get("$httpBackend");
        activityService = $injector.get("ActivityService");
        sessionService = $injector.get("SessionService");

        sessionService.setCredentials({
            environment,
            token,
            accountId
        });

        $httpBackend
            .when("POST", api)
            .respond([activity]);

        $httpBackend.whenGET(/^app\/.*\.html$/).respond(200);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("getActivities", () => {
        activityService.getActivities().then(activities => {
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
        });
        $httpBackend.flush();
    });

    it("addActivity", () => {
        expect(() => {
            activityService.addActivity(activity);
        }).to.not.throw(TypeError);
    });
});
