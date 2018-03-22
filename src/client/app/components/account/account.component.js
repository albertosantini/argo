import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { AccountTemplate } from "./account.template.js";
import { AccountController } from "./account.controller.js";

export class AccountComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("account"));

        this.accountController = new AccountController(render, AccountTemplate);
    }
}
