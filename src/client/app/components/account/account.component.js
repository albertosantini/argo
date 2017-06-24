import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { AccountTemplate } from "./account.template";
import { AccountController } from "./account.controller";

export class AccountComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("account"));

        this.accountController = new AccountController(render, AccountTemplate);
    }
}
