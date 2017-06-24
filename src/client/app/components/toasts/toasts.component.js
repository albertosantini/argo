import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { ToastsTemplate } from "./toasts.template";
import { ToastsController } from "./toasts.controller";

export class ToastsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("toasts"));

        this.toastsController = new ToastsController(render, ToastsTemplate);
    }
}
