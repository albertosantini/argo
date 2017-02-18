export class AccountController {
    constructor(AccountService) {
        this.AccountService = AccountService;
    }

    $onInit() {
        this.account = this.AccountService.getAccount();
    }
}
AccountController.$inject = ["AccountsService"];
