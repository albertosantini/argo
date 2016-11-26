"use strict";

(function () {
    angular
        .module("components.header")
        .controller("TokenDialog", TokenDialog);

    TokenDialog.$inject = ["$mdDialog"];
    function TokenDialog($mdDialog) {
        var vm = this;

        vm.environment = "practice";

        vm.hide = function () {
            $mdDialog.hide();
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.answer = function (token) {
            $mdDialog.hide(token);
        };
    }

}());
