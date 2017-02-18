import angular from "angular";

import { pluginsComponent } from "./plugins.component";
import { PluginsService } from "./plugins.service";

export const plugins = angular
    .module("components.plugins", [])
    .component("plugins", pluginsComponent)
    .service("PluginsService", PluginsService)
    .name;
