import hyperHTML from "hyperHTML";

import { Util } from "../../util";

export class PositionsTemplate {
    static update(render, state) {
        const isNoPositions = Util.hide(state.positions.length);
        const isPositions = Util.show(state.positions.length);

        /* eslint-disable indent */
        render`
            <div style="${isNoPositions}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No positions.</p>
            </div>

            <div style="${isPositions}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Type</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Units</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Avg. Price</th>
                    </thead>

                    <tbody>${
                        state.positions.map(position => {
                            const classes = "pv1 pr1 bb b--black-20 tr";

                            return hyperHTML.wire(position, ":tr")`<tr>
                                <td class="${classes}">${position.side}</td>
                                <td class="${classes}">${position.instrument}</td>
                                <td class="${classes}">${Util.formatNumber(position.units)}</td>
                                <td class="${classes}">${position.avgPrice}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>
        `;
        /* eslint-enable indent */
    }
}
