"use strict";

(function () {
    angular
        .module("components.account")
        .controller("AccountsBottomSheet", AccountsBottomSheet);

    AccountsBottomSheet.$inject = ["$mdBottomSheet", "accounts"];
    function AccountsBottomSheet($mdBottomSheet, accounts) {
        var vm = this;

        vm.accounts = accounts;

        vm.onAccountClick = function ($index) {
            var account = accounts[$index];

            $mdBottomSheet.hide(account);
        };
    }

}());
