import { Util } from "../../util";

export class AccountTemplate {
    static update(render, state) {
        if (state.account.id.toString()) {
            AccountTemplate.renderAccount(render, state);
        } else {
            AccountTemplate.renderNoAccount(render);
        }
    }

    static renderAccount(render, state) {
        const timestamp = Util.formatDate(new Date(state.account.timestamp));
        const balance = parseFloat(state.account.balance).toFixed(2);
        const unrealizedPL = parseFloat(state.account.unrealizedPL).toFixed(2);
        const unrealizedPLPercent = parseFloat(state.account.unrealizedPLPercent).toFixed(2);
        const NAV = parseFloat(state.account.NAV).toFixed(2);
        const pl = parseFloat(state.account.pl).toFixed(2);
        const marginCallMarginUsed = parseFloat(state.account.marginCallMarginUsed).toFixed(2);
        const marginAvailable = parseFloat(state.account.marginAvailable).toFixed(2);
        const marginCloseoutPositionValue = parseFloat(state.account.marginCloseoutPositionValue).toFixed(2);
        const marginCloseoutPercent = parseFloat(state.account.marginCloseoutPercent).toFixed(2);
        const positionValue = parseFloat(state.account.positionValue).toFixed(2);

        /* eslint-disable indent */
        render`
            <div class="h6 overflow-auto">
                <table class="collapse f6 w-100 mw8 center">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1">Account Summary</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1">
                            ${timestamp} (${state.account.currency})
                        </th>
                    </thead>

                    <tbody>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Balance</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${balance}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Unrealized P&amp;L</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${unrealizedPL}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Unrealized P&amp;L (%)</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${unrealizedPLPercent}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Net Asset Value</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${NAV}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Realized P&amp;L</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${pl}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Margin Used</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${marginCallMarginUsed}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Margin Available</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${marginAvailable}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Margin Closeout Value</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${marginCloseoutPositionValue}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Margin Closeout Value (%)</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${marginCloseoutPercent}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Position Value</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${positionValue}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        /* eslint-enable indent */
    }

    static renderNoAccount(render) {
        /* eslint-disable indent */
        render`
            <div class="h6 overflow-auto">
                <p class="f6 w-100 mw8 center b">No account.</p>
            </div>
        `;
        /* eslint-enable indent */
    }
}
