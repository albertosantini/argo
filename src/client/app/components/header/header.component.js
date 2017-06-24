import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { HeaderTemplate } from "./header.template";
import { HeaderController } from "./header.controller";

export class HeaderComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("header"));

        this.HeaderController = new HeaderController(render, HeaderTemplate);
    }
}
