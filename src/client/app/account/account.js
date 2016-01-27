"use strict";

(function () {
    angular
        .module("argo")
        .component("account", {
            controller: Account,
            templateUrl: "app/account/account.html"
        });

    Account.$inject = ["accountsService"];
    function Account(accountService) {
        var vm = this;

        vm.account = accountService.getAccount();
    }

}());
