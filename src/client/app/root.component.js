import hyperHTML from "hyperHTML";
import { Util } from "./util";
import { RootTemplate } from "./root.template";

export class RootComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("root"));

        RootTemplate.update(render);
    }
}

RootComponent.bootstrap();
