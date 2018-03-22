import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { TokenDialogTemplate } from "./token-dialog.template.js";
import { TokenDialogController } from "./token-dialog.controller.js";

export class TokenDialogComponent {
    static bootstrap(state) {
        const render = hyperHTML.bind(Util.query("token-dialog"));

        this.tokenDialogController = new TokenDialogController(render, TokenDialogTemplate, state);
    }
}
