"use strict";

{
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
        const vm = this;

        vm.hide = () => {
            $mdDialog.hide();
        };

        vm.cancel = () => {
            $mdDialog.cancel();
        };

        vm.answer = settings => {
            $mdDialog.hide(settings);
        };
    }

}
