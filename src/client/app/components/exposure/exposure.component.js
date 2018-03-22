import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { ExposureTemplate } from "./exposure.template.js";
import { ExposureController } from "./exposure.controller.js";

export class ExposureComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("exposure"));

        this.exposureController = new ExposureController(render, ExposureTemplate);
    }
}
