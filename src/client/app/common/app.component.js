import hyperHTML from "hyperHTML";

import { Util } from "../util.js";
import { AppTemplate } from "./app.template.js";
import { AppController } from "./app.controller.js";

export class AppComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("app"));

        this.appController = new AppController(render, AppTemplate);
    }
}

AppComponent.bootstrap();
