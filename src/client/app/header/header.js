"use strict";

(function () {
    angular
        .module("argo")
        .controller("Header", Header);

    Header.$inject = ["$mdDialog", "$mdBottomSheet", "toastService",
                    "accountsService", "sessionService", "streamService",
                    "localStorageService"];
    function Header($mdDialog, $mdBottomSheet, toastService,
                    accountsService, sessionService, streamService,
                    localStorageService) {
        var vm = this,
            instrs = localStorageService.get("instruments") || {
               "EUR_USD": true,
               "USD_JPY": true,
               "GBP_USD": true,
               "EUR_GBP": true,
               "USD_CHF": true,
               "EUR_JPY": true,
               "EUR_CHF": true,
               "USD_CAD": true,
               "AUD_USD": true,
               "GBP_JPY": true
            };

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
                            var instruments = Object.keys(instrs)
                                .filter(function (el) {
                                    if (instrs[el]) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });

                            accountsService.setInstruments(instruments);

                            streamService.startStream({
                                environment: vm.environment,
                                accessToken: vm.token,
                                accountId: vm.accountId,
                                instruments: instruments
                            });
                        });
                    });
                }, function (err) {
                    toastService.show(err);
                });
            });
        }

        function openSettingsDialog(event) {
            sessionService.isLogged().then(function (credentials) {
                $mdDialog.show({
                    controller: "SettingsDialog",
                    controllerAs: "vm",
                    templateUrl: "app/header/settings-dialog.html",
                    locals: {instruments: instrs},
                    targetEvent: event
                }).then(function (settingsInfo) {
                    var instruments;

                    if (settingsInfo) {
                        localStorageService.set("instruments", settingsInfo);

                        instruments = Object.keys(settingsInfo)
                            .filter(function (el) {
                                if (instrs[el]) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });

                        accountsService.setInstruments(instruments);

                        streamService.startStream({
                            environment: credentials.environment,
                            accessToken: credentials.token,
                            accountId: credentials.accountId,
                            instruments: instruments
                        });
                    }
                });
            });
        }
    }
}());
