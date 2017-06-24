import hyperHTML from "hyperHTML";

import { Util } from "../../util";

export class QuotesTemplate {
    static update(render, state) {
        if (!Object.keys(state.quotes).length) {
            Util.renderEmpty(render);
            return;
        }

        /* eslint-disable indent */
        render`
            <div class="h5 overflow-auto">

                <table class="collapse f6 w-100 mw8 center">
                    <tbody>${
                        Object.keys(state.quotes).map(instrument => {
                            const quote = state.quotes[instrument];

                            return hyperHTML.wire(quote, ":tr")`<tr>
                                <td class="pv1 pr1 bb b--black-20"> ${instrument} </td>
                                <td class="pv1 pr1 bb b--black-20">
                                    <sl-chart data-instrument="${instrument}" data-quote="${JSON.stringify(quote)}" length="100"></sl-chart>
                                </td>
                                <td class="${QuotesTemplate.highlighter(quote.bid, instrument, "bid")}"> ${quote.bid} </td>
                                <td class="${QuotesTemplate.highlighter(quote.ask, instrument, "ask")}"> ${quote.ask} </td>
                                <td class="${QuotesTemplate.highlighter(quote.spread, instrument, "spread")}"> ${quote.spread} </td>
                            </tr>`;
                    })}</tbody>
                </table>
           </div>
        `;
        /* eslint-enable indent */
    }

    static highlighter(value, instrument, type) {
        const classes = "pv1 pr1 bb b--black-20 tr";
        const quoteClasses = `${instrument}-${type} ${classes}`;
        const greenClass = "highlight-green";
        const redClass = "highlight-red";

        if (!QuotesTemplate.cache[instrument]) {
            QuotesTemplate.cache[instrument] = {};
        }

        if (!QuotesTemplate.cache[instrument][type]) {
            QuotesTemplate.cache[instrument][type] = {};
        }

        const cache = QuotesTemplate.cache[instrument][type];
        const oldValue = cache.value;

        const highlight = value >= oldValue
            ? `${quoteClasses} ${greenClass}`
            : `${quoteClasses} ${redClass}`;

        cache.value = value;

        clearTimeout(cache.timeout);
        cache.timeout = setTimeout(() => {
            const el = document.querySelector(`.${instrument}-${type}`);

            if (el) {
                el.classList.remove(greenClass);
                el.classList.remove(redClass);
            }
        }, 500);

        return highlight;
    }
}

QuotesTemplate.cache = {};
