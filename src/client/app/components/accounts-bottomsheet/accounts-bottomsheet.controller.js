export class AccountsBottomsheetController {
    constructor($mdBottomSheet) {
        this.$mdBottomSheet = $mdBottomSheet;
    }

    onAccountClick($index) {
        const account = this.accounts[$index];

        this.$mdBottomSheet.hide(account);
    }
}
AccountsBottomsheetController.$inject = ["$mdBottomSheet"];
