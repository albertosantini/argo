"use strict";

describe("Module Routes", function () {
    var $httpBackend;

    beforeEach(module("argo"));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get("$httpBackend");
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("test", function () {
        $httpBackend.expectGET("app/layout/default.html").respond(200);
        $httpBackend.expectGET("app/header/header.html").respond(200);
        $httpBackend.expectGET("app/trades/trades.html").respond(200);
        $httpBackend.expectGET("app/orders/orders.html").respond(200);
        $httpBackend.expectGET("app/positions/positions.html").respond(200);
        $httpBackend.expectGET("app/exposure/exposure.html").respond(200);
        $httpBackend.expectGET("app/activity/activity.html").respond(200);
        $httpBackend.expectGET("app/news/news.html").respond(200);
        $httpBackend.expectGET("app/account/account.html").respond(200);
        $httpBackend.expectGET("app/quotes/quotes.html").respond(200);
        $httpBackend.expectGET("app/charts/charts.html").respond(200);

        $httpBackend.flush();
    });

});
