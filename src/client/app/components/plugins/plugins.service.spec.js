import { PluginsService } from "./plugins.service.js";
import { SessionService } from "../session/session.service.js";

const assert = window.chai.assert;

describe("pluginsService", () => {
    const environment = "my environment";
    const token = "my token";
    const accountId = "my account id";
    const mockedPlugins = {
        testPlugin: true
    };

    beforeEach(() => {
        const apiPlugins = "/api/plugins";

        /* eslint no-new:off */
        new PluginsService({
            plugins: {},
            pluginsInfo: {}
        });

        SessionService.setCredentials({
            environment,
            token,
            accountId
        });

        fetch.mock(apiPlugins, mockedPlugins);
    });

    it("refresh plugins", done => {
        PluginsService.refresh().then(() => {
            const pluginsInfo = PluginsService.pluginsInfo;

            assert.strictEqual(1, pluginsInfo.count);
        }).then(done).catch(done);
    });
});
