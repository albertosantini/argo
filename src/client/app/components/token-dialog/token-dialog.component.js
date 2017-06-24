import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { TokenDialogTemplate } from "./token-dialog.template";
import { TokenDialogController } from "./token-dialog.controller";

export class TokenDialogComponent {
    static bootstrap(state) {
        const render = hyperHTML.bind(Util.query("token-dialog"));

        this.tokenDialogController = new TokenDialogController(render, TokenDialogTemplate, state);
    }
}
