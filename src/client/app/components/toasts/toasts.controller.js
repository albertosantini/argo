import Introspected from "introspected";

import { ToastsService } from "./toasts.service";

export class ToastsController {
    constructor(render, template) {

        this.state = Introspected({
            toasts: []
        }, state => template.update(render, state));

        this.ToastsService = new ToastsService(this.state.toasts);
    }
}
