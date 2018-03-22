import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { YesNoDialogTemplate } from "./yesno-dialog.template.js";
import { YesNoDialogController } from "./yesno-dialog.controller.js";

export class YesNoDialogComponent {
    static bootstrap(state, events) {
        const render = hyperHTML.bind(Util.query("yesno-dialog"));

        this.yesnoDialogController = new YesNoDialogController(render, YesNoDialogTemplate, state, events);
    }
}
