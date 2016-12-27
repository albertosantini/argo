"use strict";

{
    angular
        .module("components.header")
        .component("header", {
            controller: Header,
            templateUrl: "app/components/header/header.html"
        });

    Header.$inject = ["$window", "$rootScope", "$mdDialog", "$mdBottomSheet",
        "toastService", "accountsService", "sessionService",
        "quotesService", "streamingService"];
    function Header($window, $rootScope, $mdDialog, $mdBottomSheet,
        toastService, accountsService, sessionService,
        quotesService, streamingService) {
        const vm = this,
            instrsStorage = $window.localStorage.getItem("argo.instruments"),
            instrs = angular.fromJson(instrsStorage) || {
                EUR_USD: true,
                USD_JPY: true,
                GBP_USD: true,
                EUR_GBP: true,
                USD_CHF: true,
                EUR_JPY: true,
                EUR_CHF: true,
                USD_CAD: true,
                AUD_USD: true,
                GBP_JPY: true
            };

        vm.isLoadingViewWatcher = $rootScope.$watch("isLoadingView", () => {
            vm.isLoadingView = $rootScope.isLoadingView;
        });

        vm.openTokenDialog = openTokenDialog;
        vm.openSettingsDialog = openSettingsDialog;

        function openTokenDialog(event) {
            $mdDialog.show({
                template: "<token-dialog aria-label='Token Dialog'></token-dialog>",
                targetEvent: event
            }).then(tokenInfo => {
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
                }).then(accounts => {
                    const scope = angular.extend($rootScope.$new(true), {
                        accounts
                    });

                    $mdBottomSheet.show({
                        template: "<accounts-bottomsheet accounts='accounts'></accounts-bottomsheet>",
                        scope,
                        preserveScope: true,
                        targetEvent: event
                    }).then(accountSelected => {
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
                        }).then(() => {
                            const instruments = accountsService
                                .setStreamingInstruments(instrs);

                            streamingService.startStream({
                                environment: vm.environment,
                                accessToken: vm.token,
                                accountId: vm.accountId,
                                instruments
                            });
                        });
                    });
                }, err => {
                    toastService.show(err);
                });
            })
            .catch(err => {
                if (err) {
                    toastService.show(err);
                }
            });
        }

        function openSettingsDialog(event) {
            sessionService.isLogged().then(credentials => {
                const allInstrs = accountsService.getAccount().instruments;

                angular.forEach(allInstrs, instrument => {
                    if (!instrs.hasOwnProperty(instrument.name)) {
                        instrs[instrument.name] = false;
                    }
                });

                const scope = angular.extend($rootScope.$new(true), {
                    instruments: instrs
                });

                $mdDialog.show({
                    template: "<settings-dialog aria-label='Settings Dialog' instruments='instruments'></settings-dialog>",
                    scope,
                    preserveScope: true,
                    targetEvent: event
                }).then(settingsInfo => {
                    let instruments;

                    if (settingsInfo) {
                        $window.localStorage.setItem("argo.instruments",
                            angular.toJson(settingsInfo));
                        instruments = accountsService
                            .setStreamingInstruments(settingsInfo);

                        quotesService.reset();

                        streamingService.startStream({
                            environment: credentials.environment,
                            accessToken: credentials.token,
                            accountId: credentials.accountId,
                            instruments
                        });
                    }
                })
                .catch(err => {
                    if (err) {
                        toastService.show(err);
                    }
                });
            });
        }
    }
}
