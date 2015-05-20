"use strict";

(function () {
    angular
        .module("argo")
        .controller("Plugins", Plugins);

    Plugins.$inject = ["pluginsService"];
    function Plugins(pluginsService) {
        var vm = this;

        vm.engage = engage;

        activate();

        function activate() {
            pluginsService.getPlugins().then(function (plugins) {
                vm.plugins = plugins;
                vm.noPlugins = Object.keys(plugins).length === 0;
            });
        }

        function engage() {
            pluginsService.engagePlugins(vm.plugins);
        }
    }

}());
