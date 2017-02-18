export class PluginsController {
    constructor(PluginsService) {
        this.PluginsService = PluginsService;
    }

    $onInit() {
        this.plugins = this.PluginsService.getPlugins();
        this.pluginsInfo = this.PluginsService.getPluginsInfo();

        this.PluginsService.refresh();
    }

    engage() {
        this.PluginsService.engagePlugins(this.plugins);
    }
}
PluginsController.$inject = ["PluginsService"];
