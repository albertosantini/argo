import Introspected from "introspected";

import { QuotesService } from "./quotes.service";

export class QuotesController {
    constructor(render, template) {

        this.state = Introspected({
            quotes: {}
        }, state => template.update(render, state));

        this.quotesService = new QuotesService(this.state.quotes);
    }
}
