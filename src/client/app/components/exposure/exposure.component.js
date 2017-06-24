import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { ExposureTemplate } from "./exposure.template";
import { ExposureController } from "./exposure.controller";

export class ExposureComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("exposure"));

        this.exposureController = new ExposureController(render, ExposureTemplate);
    }
}
