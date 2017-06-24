import hyperHTML from "hyperHTML";

import { Util } from "../../util";

export class ActivityTemplate {
    static update(render, state) {
        if (state.activities.length) {
            ActivityTemplate.renderActivity(render, state);
        } else {
            ActivityTemplate.renderNoActivity(render);
        }
    }

    static renderActivity(render, state) {
        /* eslint-disable indent */
        render`
            <div class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Ticket</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Type</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Units</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Price</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Profit</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Balance</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Date/Time</th>
                    </thead>

                    <tbody>${
                        state.activities.map(activity => {
                            const classes = "pv1 pr1 bb b--black-20 tr";
                            const highlight = classes +
                                (activity.pl >= 0 ? " highlight-green" : " highlight-red");

                            return hyperHTML.wire(activity, ":tr")`<tr>
                                <td class="${classes}"> ${activity.id} </td>
                                <td class="${classes}"> ${activity.type} </td>
                                <td class="${classes}"> ${activity.instrument} </td>
                                <td class="${classes}"> ${Util.formatNumber(activity.units)} </td>
                                <td class="${classes}"> ${activity.price} </td>
                                <td class="${highlight}"> ${Util.formatNumber(activity.pl, 4)} </td>
                                <td class="${classes}"> ${Util.formatNumber(activity.accountBalance, 2)} </td>
                                <td class="${classes}"> ${Util.formatDate(activity.time)} </td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>
        `;
        /* eslint-enable indent */
    }

    static renderNoActivity(render) {
        /* eslint-disable indent */
        render`
            <div class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No activities.</p>
            </div>
        `;
        /* eslint-enable indent */
    }
}
