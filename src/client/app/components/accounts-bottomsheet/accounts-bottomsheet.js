"use strict";

{
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
        const vm = this;

        vm.onAccountClick = $index => {
            const account = vm.accounts[$index];

            $mdBottomSheet.hide(account);
        };
    }

}
