import hyperHTML from "hyperHTML";
import { Util } from "../util";
import { AppTemplate } from "./app.template";
import { AppController } from "./app.controller";

export class AppComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("app"));

        this.appController = new AppController(render, AppTemplate);
    }
}

AppComponent.bootstrap();
