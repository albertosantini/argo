/* eslint-env mocha */
/* global angular, assert, inject */

describe("pluginsService", () => {
    let pluginsService;

    beforeEach(module("components"));

    beforeEach(inject($injector => {
        pluginsService = $injector.get("PluginsService");
    }));

    it("getPlugins", () => {
        const plugins = pluginsService.getPlugins();

        assert.equal(true, angular.isObject(plugins));
    });

    it("getPluginsInfo", () => {
        const pluginsInfo = pluginsService.getPluginsInfo();

        assert.equal(true, angular.isObject(pluginsInfo));
        assert.equal(0, pluginsInfo.count);
    });

});
