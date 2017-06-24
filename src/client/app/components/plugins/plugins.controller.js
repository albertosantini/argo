import Introspected from "introspected";

import { PluginsService } from "../plugins/plugins.service";
import { Util } from "../../util";

export class PluginsController {
    constructor(render, template) {
        const events = (e, payload) => Util.handleEvent(this, e, payload);

        this.state = Introspected({
            plugins: {},
            pluginsInfo: {
                count: 0
            }
        }, state => template.update(render, state, events));

        this.pluginService = new PluginsService(this.state);

        PluginsService.refresh();
    }

    onTogglePluginChange(e, plugin) {
        this.state.plugins[plugin] = e.target.checked;
        PluginsService.engagePlugins(this.state.plugins);
    }
}
PluginsController.$inject = ["PluginsService"];
