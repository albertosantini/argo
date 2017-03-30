/* eslint-env mocha */
/* global angular, assert */

describe("components module", () => {
    it("should be defined", () => {
        assert(angular.isDefined(angular.module("components")));
    });
});
