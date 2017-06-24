import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { QuotesTemplate } from "./quotes.template";
import { QuotesController } from "./quotes.controller";

export class QuotesComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("quotes"));

        this.quotesController = new QuotesController(render, QuotesTemplate);
    }
}
