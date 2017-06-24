import hyperHTML from "hyperHTML";

import { Util } from "../../util";

export class ExposureTemplate {
    static update(render, state) {
        const isNoExposure = Util.hide(state.exposure.length);
        const isExposure = Util.show(state.exposure.length);

        /* eslint-disable indent */
        render`
            <div style="${isNoExposure}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No exposures.</p>
            </div>

            <div style="${isExposure}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Type</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Units</th>
                    </thead>

                    <tbody>${
                        state.exposure.map(exposure => {
                            const classes = "pv1 pr1 bb b--black-20 tr";

                            return hyperHTML.wire(exposure, ":tr")`<tr>
                                <td class="${classes}">${exposure.type}</td>
                                <td class="${classes}">${exposure.market}</td>
                                <td class="${classes}">${Util.formatNumber(exposure.units)}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>
        `;
        /* eslint-enable indent */
    }
}
