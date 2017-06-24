import Introspected from "introspected";

import { AccountsService } from "./accounts.service";

export class AccountController {
    constructor(render, template) {

        this.state = Introspected({
            account: {}
        }, state => template.update(render, state));

        this.accountsService = new AccountsService(this.state.account);
    }
}
