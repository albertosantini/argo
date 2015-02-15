"use strict";

(function () {
    angular
        .module("argo")
        .controller("Default", Default);

    Default.$inject = ["$mdDialog", "accountsService"];
    function Default($mdDialog, accountsService) {
        var vm = this;


        vm.tabSelectedIndex = 0;

        vm.next = function () {
            vm.tabSelectedIndex = Math.min(vm.tabSelectedIndex + 1, 5);
        };
        vm.previous = function () {
            vm.tabSelectedIndex = Math.max(vm.tabSelectedIndex - 1, 0);
        };

        vm.openTokenDialog = function (ev) {
            $mdDialog.show({
                controller: "TokenDialog",
                controllerAs: "dialog",
                templateUrl: "app/layout/token-dialog.html",
                targetEvent: ev
            }).then(function(tokenInfo) {
                vm.environment = tokenInfo.environment;
                vm.token = tokenInfo.token;

                accountsService.getAccounts({
                    environment: vm.environment,
                    token: vm.token
                }).then(function (accounts) {
                    console.log(accounts);
                }, function (err) {
                    console.log(err);
                });
            });
        };
    }
}());
