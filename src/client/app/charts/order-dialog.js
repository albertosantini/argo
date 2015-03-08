"use strict";

(function () {
    angular
        .module("argo")
        .controller("OrderDialog", OrderDialog);

    OrderDialog.$inject = ["$mdDialog", "params"];
    function OrderDialog($mdDialog, params) {
        var vm = this;

        vm.side = params.side;
        vm.instruments = params.instruments;
        vm.selectedInstrument = params.selectedInstrument;
        vm.selectedExpire = params.selectedExpire;
        vm.type = "market";
        vm.isLowerBound = false;
        vm.isUpperBound = false;
        vm.isTakeProfit = false;
        vm.isStopLoss = false;
        vm.isTralingStop = false;
        vm.expires = [
            "1 Week"
        ];

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
