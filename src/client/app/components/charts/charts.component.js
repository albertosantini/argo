import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { ChartsTemplate } from "./charts.template";
import { ChartsController } from "./charts.controller";

export class ChartsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("charts"));

        this.chartsController = new ChartsController(render, ChartsTemplate);
    }
}
