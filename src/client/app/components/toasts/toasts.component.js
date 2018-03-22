import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { ToastsTemplate } from "./toasts.template.js";
import { ToastsController } from "./toasts.controller.js";

export class ToastsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("toasts"));

        this.toastsController = new ToastsController(render, ToastsTemplate);
    }
}
