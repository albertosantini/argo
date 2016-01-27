"use strict";

(function () {
    angular
        .module("argo")
        .component("plugins", {
            controller: Plugins,
            templateUrl: "app/plugins/plugins.html"
        });

    Plugins.$inject = ["pluginsService"];
    function Plugins(pluginsService) {
        var vm = this;

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

}());
