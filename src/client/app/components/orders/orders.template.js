import { Util } from "../../util";

import hyperHTML from "hyperHTML";

export class OrdersTemplate {
    static update(render, state) {
        const isNoOrders = Util.hide(state.orders.length);
        const isOrders = Util.show(state.orders.length);

        /* eslint-disable indent */
        render`
            <div style="${isNoOrders}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No orders.</p>
            </div>

            <div style="${isOrders}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Type</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Ticket</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Units</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">S/L</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">T/P</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">T/S</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Price</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Current</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Distance</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Expiry</th>
                    </thead>

                    <tbody>${
                        state.orders.map(order => {
                            const classes = "pv1 pr1 bb b--black-20 tr";

                            return hyperHTML.wire(order, ":tr")`<tr>
                                <td class="${classes}">${order.side || order.type}</td>
                                <td class="${classes}">
                                    <a href="#" onclick="${() => {
                                        state.yesnoModalIsOpen = true;
                                        state.closeOrderInfo.orderId = order.id;
                                    }}">${order.id}</a>
                                </td>
                                <td class="${classes}">${order.instrument}</td>
                                <td class="${classes}">${Util.formatNumber(order.units)}</td>
                                <td class="${classes}">${order.stopLossOnFill.price}</td>
                                <td class="${classes}">${order.takeProfitOnFill.price}</td>
                                <td class="${classes}">${order.trailingStopLossOnFill.distance || order.trailingStopValue}</td>
                                <td class="${classes}">${Util.formatNumber(order.price, 4)}</td>
                                <td class="${classes}">${Util.formatNumber(order.current, 4)}</td>
                                <td class="${classes}">${Util.formatNumber(order.distance, 1)}</td>
                                <td class="${classes}">${Util.formatDate(order.expiry)}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>

            <yesno-dialog></yesno-dialog>
        `;
        /* eslint-enable indent */
    }
}
