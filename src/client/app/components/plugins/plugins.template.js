import hyperHTML from "hyperHTML";

import { Util } from "../../util";

export class PluginsTemplate {
    static update(render, state, events) {
        const pluginsKeys = Object.keys(state.plugins);
        const pluginsCount = pluginsKeys.length;
        const isNoPlugins = Util.hide(pluginsCount);
        const isPlugins = Util.show(pluginsCount);

        /* eslint-disable indent */
        render`
            <div style="${isNoPlugins}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No plugins.</p>
            </div>

            <div style="${isPlugins}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Enabled</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white">Plugin</th>
                    </thead>

                    <tbody>${
                        pluginsKeys.map((plugin, index) => {
                            const value = !!state.plugins[plugin];

                            return hyperHTML.wire()`<tr>
                                <td class="pv1 pr1 bb b--black-20 tr">
                                    <input id="${`togglePlugin-${index}`}" type="checkbox"
                                        onchange="${e => events(e, plugin)}"
                                        checked="${value}">
                                    </input>
                                </td>
                                <td class="pv1 pr1 bb b--black-20">${plugin}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>
        `;
        /* eslint-enable indent */
    }
}
