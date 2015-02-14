"use strict";

(function () {
    angular
        .module("argo")
        .controller("Default", Default);

    Default.$inject = ["$mdDialog"];
    function Default($mdDialog) {
        var vm = this;

        vm.token = null;

        vm.tabSelectedIndex = 0;

        vm.next = function() {
            vm.tabSelectedIndex = Math.min(vm.tabSelectedIndex + 1, 5);
        };
        vm.previous = function() {
            vm.tabSelectedIndex = Math.max(vm.tabSelectedIndex - 1, 0);
        };

        vm.openTokenDialog = function(ev) {
            $mdDialog.show({
                controller: "TokenDialog",
                controllerAs: "dialog",
                templateUrl: "app/layout/token-dialog.html",
                targetEvent: ev
            }).then(function(token) {
                vm.token = token;
            });
        };
    }
}());
