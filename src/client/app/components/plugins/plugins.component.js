import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { PluginsTemplate } from "./plugins.template.js";
import { PluginsController } from "./plugins.controller.js";

export class PluginsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("plugins"));

        this.pluginsController = new PluginsController(render, PluginsTemplate);
    }
}
