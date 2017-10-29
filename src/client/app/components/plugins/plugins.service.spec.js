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

        assert.strictEqual(true, angular.isObject(plugins));
    });

    it("getPluginsInfo", () => {
        const pluginsInfo = pluginsService.getPluginsInfo();

        assert.strictEqual(true, angular.isObject(pluginsInfo));
        assert.strictEqual(0, pluginsInfo.count);
    });

});
