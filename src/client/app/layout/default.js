"use strict";

(function () {
    angular
        .module("argo")
        .controller("Default", Default);

    Default.$inject = ["$rootScope", "$mdDialog",
        "$mdBottomSheet", "accountsService"];

    function Default($rootScope, $mdDialog, $mdBottomSheet,
        accountsService) {
        var vm = this;

        vm.tabSelectedIndex = 0;

        vm.next = function () {
            vm.tabSelectedIndex = Math.min(vm.tabSelectedIndex + 1, 5);
        };
        vm.previous = function () {
            vm.tabSelectedIndex = Math.max(vm.tabSelectedIndex - 1, 0);
        };

        vm.openTokenDialog = function (event) {
            $mdDialog.show({
                controller: "TokenDialog",
                controllerAs: "dialog",
                templateUrl: "app/layout/token-dialog.html",
                targetEvent: event
            }).then(function(tokenInfo) {
                if (tokenInfo) {
                    vm.environment = tokenInfo.environment;
                    vm.token = tokenInfo.token;
                } else {
                    vm.environment = "";
                    vm.token = "";
                    vm.accountId = "";
                }

                accountsService.getAccounts({
                    environment: vm.environment,
                    token: vm.token
                }).then(function (accounts) {
                    $mdBottomSheet.show({
                        controller: "AccountsBottomSheet",
                        controllerAs: "sheet",
                        templateUrl: "app/account/accounts-bottomsheet.html",
                        locals: {accounts: accounts},
                        targetEvent: event
                    }).then(function (accountSelected) {
                        vm.accountId = accountSelected.accountId;

                        accountsService.getAccounts({
                            environment: vm.environment,
                            token: vm.token,
                            accountId: vm.accountId
                        }).then(function (account) {
                            vm.account = account;
                            $rootScope.$broadcast("accountChange", account);
                        });
                    });
                });
            });
        };

        // vm.showCustomToast = function () {
        //     $mdToast.show({
        //         controller: "MyToast",
        //         controllerAs: "toast",
        //         templateUrl: "app/layout/toast.html",
        //         hideDelay: 6000,
        //         position: "bottom right"
        //     });
        // };
    }
}());
