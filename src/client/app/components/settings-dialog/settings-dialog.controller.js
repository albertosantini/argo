export class SettingsDialogController {
    constructor($mdDialog) {
        this.$mdDialog = $mdDialog;
    }

    hide() {
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    answer(settings) {
        this.$mdDialog.hide(settings);
    }
}
SettingsDialogController.$inject = ["$mdDialog"];
