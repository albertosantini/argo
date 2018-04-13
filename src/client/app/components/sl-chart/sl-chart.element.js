import { wire } from "hyperHTML";

import { QuotesService } from "../quotes/quotes.service.js";
import { SlChartTemplate } from "./sl-chart.template.js";

class SlChartElement extends HTMLElement {
    static get observedAttributes() {
        return ["data-quote"];
    }

    constructor() {
        super();

        SlChartElement.state = {
            instrument: this.dataset.instrument,
            quotes: QuotesService.getQuotes(),
            length: 100
        };
    }

    static render() {
        return SlChartTemplate.update(wire());
    }

    /* eslint class-methods-use-this: "off" */
    attributeChangedCallback(attr, oldValue, newValue) {
        SlChartElement.state.instrument = JSON.parse(newValue).instrument;

        SlChartTemplate.redraw(SlChartElement.state);
    }

}
customElements.define("sl-chart", SlChartElement);

SlChartElement.state = null;
