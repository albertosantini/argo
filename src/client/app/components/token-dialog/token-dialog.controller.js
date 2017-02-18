export class TokenDialogController {
    constructor($mdDialog) {
        this.$mdDialog = $mdDialog;
    }

    $onInit() {
        this.environment = "practice";
    }

    hide() {
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    answer(token) {
        this.$mdDialog.hide(token);
    }
}
TokenDialogController.$inject = ["$mdDialog"];
