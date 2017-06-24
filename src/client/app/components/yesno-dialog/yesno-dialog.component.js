import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { YesNoDialogTemplate } from "./yesno-dialog.template";
import { YesNoDialogController } from "./yesno-dialog.controller";

export class YesNoDialogComponent {
    static bootstrap(state, events) {
        const render = hyperHTML.bind(Util.query("yesno-dialog"));

        this.yesnoDialogController = new YesNoDialogController(render, YesNoDialogTemplate, state, events);
    }
}
