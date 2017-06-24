import hyperHTML from "hyperHTML";

import { Util } from "../../util";


export class TradesTemplate {
    static update(render, state) {
        const isNoTrades = Util.hide(state.trades.value.length);
        const isTrades = Util.show(state.trades.value.length);

        /* eslint-disable indent */
        render`
            <div style="${isNoTrades}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No trades.</p>
            </div>

            <div style="${isTrades}" class="h4 overflow-auto">
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
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Profit (PIPS)</th>
                    </thead>

                    <tbody>${
                        state.trades.value.map(trade => {
                            const classes = "pv1 pr1 bb b--black-20 tr";
                            const highlight = classes +
                                (trade.profitPips >= 0 ? " highlight-green" : " highlight-red");

                            return hyperHTML.wire(trade, ":tr")`<tr>
                                <td class="${classes}">${trade.side}</td>
                                <td class="${classes}">
                                    <a href="#" onclick="${() => {
                                        state.yesnoModalIsOpen = true;
                                        state.closeTradeInfo.tradeId = trade.id;
                                    }}">${trade.id}</a>
                                </td>
                                <td class="${classes}">${trade.instrument}</td>
                                <td class="${classes}">${Util.formatNumber(trade.currentUnits)}</td>
                                <td class="${classes}">${trade.stopLossOrder.price}</td>
                                <td class="${classes}">${trade.takeProfitOrder.price}</td>
                                <td class="${classes}">${trade.trailingStopLossOrder.distance}</td>
                                <td class="${classes}">${trade.price}</td>
                                <td class="${classes}">${trade.current}</td>
                                <td class="${highlight}">${Util.formatNumber(trade.profitPips, 1)}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>

            <yesno-dialog></yesno-dialog>
        `;
        /* eslint-enable indent */
    }
}
