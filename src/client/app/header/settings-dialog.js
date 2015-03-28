"use strict";

(function () {
    angular
        .module("argo")
        .controller("SettingsDialog", SettingsDialog);

    SettingsDialog.$inject = ["$mdDialog"];
    function SettingsDialog($mdDialog) {
        var vm = this;

        vm.hide = function () {
            $mdDialog.hide();
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.answer = function (settings) {
            $mdDialog.hide(settings);
        };
    }

}());
