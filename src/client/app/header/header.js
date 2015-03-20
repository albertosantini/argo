"use strict";

(function () {
    angular
        .module("argo")
        .controller("Header", Header);

    Header.$inject = ["$mdDialog", "$mdBottomSheet", "$http", "toastService",
                    "accountsService", "sessionService", "streamService"];
    function Header($mdDialog, $mdBottomSheet, $http, toastService,
                    accountsService, sessionService, streamService) {
        var vm = this;

        vm.openTokenDialog = function (event) {
            $mdDialog.show({
                controller: "TokenDialog",
                controllerAs: "vm",
                templateUrl: "app/header/token-dialog.html",
                targetEvent: event
            }).then(function (tokenInfo) {
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
                        controllerAs: "vm",
                        templateUrl: "app/account/accounts-bottomsheet.html",
                        locals: {accounts: accounts},
                        targetEvent: event
                    }).then(function (accountSelected) {
                        vm.accountId = accountSelected.accountId;

                        sessionService.setCredentials({
                            environment: vm.environment,
                            token: vm.token,
                            accountId: vm.accountId
                        });

                        accountsService.getAccounts({
                            environment: vm.environment,
                            token: vm.token,
                            accountId: vm.accountId
                        }).then(function () {
                            $http.post("/api/startstream", {
                                environment: vm.environment,
                                accessToken: vm.token,
                                accountId: vm.accountId
                            }).success(function (instruments) {
                                accountsService.setInstruments(instruments);

                                streamService.getStream();
                            });
                        });
                    });
                }, function (err) {
                    toastService.show(err);
                });
            });
        };
    }
}());
