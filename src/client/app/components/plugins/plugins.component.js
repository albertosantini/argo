import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { PluginsTemplate } from "./plugins.template";
import { PluginsController } from "./plugins.controller";

export class PluginsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("plugins"));

        this.pluginsController = new PluginsController(render, PluginsTemplate);
    }
}
