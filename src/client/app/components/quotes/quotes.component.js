import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { QuotesTemplate } from "./quotes.template.js";
import { QuotesController } from "./quotes.controller.js";

export class QuotesComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("quotes"));

        this.quotesController = new QuotesController(render, QuotesTemplate);
    }
}
