import hyperHTML from "hyperHTML";

import { Util } from "../../util";

export class NewsTemplate {
    static update(render, state) {
        const isNoNews = Util.hide(state.news.length);
        const isNews = Util.show(state.news.length);

        /* eslint-disable indent */
        render`
            <div style="${isNoNews}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No news.</p>
            </div>

            <div style="${isNews}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Date/Time</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Event</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Previous</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Forecast</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Actual</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Unit</th>
                    </thead>

                    <tbody>${
                        state.news.map(news => {
                            const classes = "pv1 pr1 bb b--black-20 tr";

                            return hyperHTML.wire(news, ":tr")`<tr>
                                <td class="${classes}">${Util.formatDate(news.timestamp)}</td>
                                <td class="${classes}">${news.currency}</td>
                                <td class="${classes}">${news.title}</td>
                                <td class="${classes}">${Util.formatNumber(news.previous)}</td>
                                <td class="${classes}">${Util.formatNumber(news.forecast)}</td>
                                <td class="${classes}">${Util.formatNumber(news.actual)}</td>
                                <td class="${classes}">${news.unit}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>
        `;
        /* eslint-enable indent */
    }
}
