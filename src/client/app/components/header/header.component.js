import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { HeaderTemplate } from "./header.template.js";
import { HeaderController } from "./header.controller.js";

export class HeaderComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("header"));

        this.HeaderController = new HeaderController(render, HeaderTemplate);
    }
}
