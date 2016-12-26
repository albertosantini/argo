"use strict";

{
    angular
        .module("components.account")
        .component("account", {
            controller: Account,
            templateUrl: "app/components/account/account.html"
        });

    Account.$inject = ["accountsService"];
    function Account(accountService) {
        const vm = this;

        vm.account = accountService.getAccount();
    }

}
