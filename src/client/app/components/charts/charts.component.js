import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { ChartsTemplate } from "./charts.template.js";
import { ChartsController } from "./charts.controller.js";

export class ChartsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("charts"));

        this.chartsController = new ChartsController(render, ChartsTemplate);
    }
}
