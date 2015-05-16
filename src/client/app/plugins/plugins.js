"use strict";

(function () {
    angular
        .module("argo")
        .controller("Plugins", Plugins);

    Plugins.$inject = ["pluginsService"];
    function Plugins(pluginsService) {
        var vm = this;

        pluginsService.getPlugins().then(function (plugins) {
            vm.plugins = plugins;
        });
    }

}());
