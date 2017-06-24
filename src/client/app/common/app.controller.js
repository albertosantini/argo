import Introspected from "introspected";

export class AppController {
    constructor(render, template) {
        this.state = Introspected({
            tabSelectedIndex: 0
        }, state => template.update(render, state));
    }
}
