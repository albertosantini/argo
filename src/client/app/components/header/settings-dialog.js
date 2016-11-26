"use strict";

(function () {
    angular
        .module("components.header")
        .controller("SettingsDialog", SettingsDialog);

    SettingsDialog.$inject = ["$mdDialog", "instruments"];
    function SettingsDialog($mdDialog, instruments) {
        var vm = this;

        vm.instruments = instruments;

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
