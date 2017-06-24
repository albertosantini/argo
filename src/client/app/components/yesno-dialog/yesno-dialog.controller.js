import Introspected from "introspected";

export class YesNoDialogController {
    constructor(render, template, bindings, events) {
        Introspected.observe(bindings,
            state => template.update(render, state, events));
    }
}
