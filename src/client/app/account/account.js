"use strict";

(function () {
    angular
        .module("argo")
        .controller("Account", Account);

    Account.$inject = ["accountsService"];
    function Account(accountService) {
        var vm = this;

        accountService.getActiveAccount().then(function (account) {
            var unrealizedPlPerc,
                netAssetValue;

            vm.account = account;

            unrealizedPlPerc = account.unrealizedPl / account.balance * 100;
            netAssetValue = account.balance + account.unrealizedPl;

            vm.account.unrealizedPlPerc = unrealizedPlPerc;
            vm.account.netAssetValue = netAssetValue;
        });
    }

}());
