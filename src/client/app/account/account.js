"use strict";

(function () {
    angular
        .module("argo")
        .controller("Account", Account);

    Account.$inject = ["$rootScope"];
    function Account($rootScope) {
        var vm = this;

        $rootScope.$on("accountChange", function ($scope, account) {
            vm.account = account;
        });
    }

}());
