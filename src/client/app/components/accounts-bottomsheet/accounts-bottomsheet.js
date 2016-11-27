"use strict";

(function () {
    angular
        .module("components.accounts-bottomsheet")
        .component("accountsBottomsheet", {
            controller: AccountsBottomSheet,
            templateUrl: "app/components/accounts-bottomsheet/accounts-bottomsheet.html",
            bindings: {
                accounts: "<"
            }
        });

    AccountsBottomSheet.$inject = ["$mdBottomSheet"];
    function AccountsBottomSheet($mdBottomSheet) {
        var vm = this;

        vm.onAccountClick = function ($index) {
            var account = vm.accounts[$index];

            $mdBottomSheet.hide(account);
        };
    }

}());
