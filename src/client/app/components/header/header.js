"use strict";

(function () {
    angular
        .module("components.header")
        .component("header", {
            controller: Header,
            templateUrl: "app/components/header/header.html"
        });

    Header.$inject = ["$window", "$rootScope", "$mdDialog", "$mdBottomSheet",
        "toastService", "accountsService", "sessionService",
        "quotesService", "streamingService"];
    /*eslint-disable max-len */
    function Header($window, $rootScope, $mdDialog, $mdBottomSheet, toastService, accountsService, sessionService, quotesService, streamingService) {
    /*eslint-enable */
        var vm = this,
            instrsStorage = $window.localStorage.getItem("argo.instruments"),
            instrs = JSON.parse(instrsStorage) || {
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

        $rootScope.$watch("isLoadingView", function () {
            vm.isLoadingView = $rootScope.isLoadingView;
        });

        vm.openTokenDialog = openTokenDialog;
        vm.openSettingsDialog = openSettingsDialog;

        function openTokenDialog(event) {
            $mdDialog.show({
                template: "<token-dialog aria-label='Token Dialog'></token-dialog>",
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
                    var scope = angular.extend($rootScope.$new(true), {
                        accounts: accounts
                    });

                    $mdBottomSheet.show({
                        template: "<accounts-bottomsheet accounts='accounts'></accounts-bottomsheet>",
                        scope: scope,
                        preserveScope: true,
                        targetEvent: event
                    }).then(function (accountSelected) {
                        vm.accountId = accountSelected.id;

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
                            var instruments = accountsService
                                .setStreamingInstruments(instrs);

                            streamingService.startStream({
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
                var allInstrs = accountsService.getAccount().instruments,
                    scope;

                angular.forEach(allInstrs, function (instrument) {
                    if (!instrs.hasOwnProperty(instrument.name)) {
                        instrs[instrument.name] = false;
                    }
                });

                scope = angular.extend($rootScope.$new(true), {
                    instruments: instrs
                });

                $mdDialog.show({
                    template: "<settings-dialog aria-label='Settings Dialog' instruments='instruments'></settings-dialog>",
                    scope: scope,
                    preserveScope: true,
                    targetEvent: event
                }).then(function (settingsInfo) {
                    var instruments;

                    if (settingsInfo) {
                        $window.localStorage.setItem("argo.instruments",
                            JSON.stringify(settingsInfo));
                        instruments = accountsService
                            .setStreamingInstruments(settingsInfo);

                        quotesService.reset();

                        streamingService.startStream({
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
