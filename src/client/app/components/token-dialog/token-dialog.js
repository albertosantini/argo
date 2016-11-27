"use strict";

(function () {
    angular
        .module("components.token-dialog")
        .component("tokenDialog", {
            controller: TokenDialog,
            templateUrl: "app/components/token-dialog/token-dialog.html"
        });

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
