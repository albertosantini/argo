"use strict";

(function () {
    angular
        .module("argo")
        .controller("Account", Account);

    Account.$inject = ["accountsService"];
    function Account(accountService) {
        var vm = this;

        vm.account = accountService.getAccount();
    }

}());
