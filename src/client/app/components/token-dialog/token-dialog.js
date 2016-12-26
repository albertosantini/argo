"use strict";

{
    angular
        .module("components.token-dialog")
        .component("tokenDialog", {
            controller: TokenDialog,
            templateUrl: "app/components/token-dialog/token-dialog.html"
        });

    TokenDialog.$inject = ["$mdDialog"];
    function TokenDialog($mdDialog) {
        const vm = this;

        vm.environment = "practice";

        vm.hide = () => {
            $mdDialog.hide();
        };

        vm.cancel = () => {
            $mdDialog.cancel();
        };

        vm.answer = token => {
            $mdDialog.hide(token);
        };
    }

}
