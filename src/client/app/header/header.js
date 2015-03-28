"use strict";

(function () {
    angular
        .module("argo")
        .controller("Header", Header);

    Header.$inject = ["$mdDialog", "$mdBottomSheet", "$http", "toastService",
                    "accountsService", "sessionService", "streamService",
                    "localStorageService"];
    function Header($mdDialog, $mdBottomSheet, $http, toastService,
                    accountsService, sessionService, streamService,
                    localStorageService) {
        var vm = this;

        vm.openTokenDialog = openTokenDialog;
        vm.openSettingsDialog = openSettingsDialog;

        function openTokenDialog(event) {
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
        }

        function openSettingsDialog(event) {
            var instruments = localStorageService.get("instruments");

            $mdDialog.show({
                controller: "SettingsDialog",
                controllerAs: "vm",
                templateUrl: "app/header/settings-dialog.html",
                locals: {instruments: instruments},
                targetEvent: event
            }).then(function (settingsInfo) {
                console.log(instruments);
                localStorageService.set("instruments", settingsInfo);
            });
        }
    }
}());
