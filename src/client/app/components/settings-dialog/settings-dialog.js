"use strict";

(function () {
    angular
        .module("components.settings-dialog")
        .component("settingsDialog", {
            controller: SettingsDialog,
            templateUrl: "app/components/settings-dialog/settings-dialog.html",
            bindings: {
                instruments: "<"
            }
        });

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
