"use strict";

{
    angular
        .module("components.plugins")
        .component("plugins", {
            controller: Plugins,
            templateUrl: "app/components/plugins/plugins.html"
        });

    Plugins.$inject = ["pluginsService"];
    function Plugins(pluginsService) {
        const vm = this;

        vm.engage = engage;
        vm.plugins = pluginsService.getPlugins();
        vm.pluginsInfo = pluginsService.getPluginsInfo();

        activate();

        function activate() {
            pluginsService.refresh();
        }

        function engage() {
            pluginsService.engagePlugins(vm.plugins);
        }
    }

}
