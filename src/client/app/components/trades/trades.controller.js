import Introspected from "introspected";

import { ToastsService } from "../toasts/toasts.service";
import { TradesService } from "../trades/trades.service";
import { Util } from "../../util";
import { YesNoDialogComponent } from "../yesno-dialog/yesno-dialog.component";

export class TradesController {
    constructor(render, template) {
        const events = (e, payload) => Util.handleEvent(this, e, payload);

        this.state = Introspected({
            trades: {
                value: []
            },
            yesnoModalIsOpen: false,
            yesnoModalText: "Are you sure to close the trade?",
            closeTradeInfo: {
                tradeId: null
            }
        }, state => template.update(render, state));

        this.tradesService = new TradesService(this.state.trades);

        YesNoDialogComponent.bootstrap(this.state, events);
    }

    onCancelYesNoDialogClick() {
        this.state.yesnoModalIsOpen = false;
    }

    onOkYesNoDialogClick() {
        this.state.yesnoModalIsOpen = false;

        TradesService.closeTrade(this.state.closeTradeInfo.tradeId).then(trade => {
            let message = "Closed " +
                    `${(trade.units > 0 ? "sell" : "buy")} ` +
                    `${trade.instrument} ` +
                    `#${trade.id} ` +
                    `@${trade.price} ` +
                    `P&L ${trade.pl}`;

            if (trade.errorMessage || trade.message) {
                message = `ERROR ${trade.errorMessage || trade.message}`;
            }

            ToastsService.addToast(message);
        }).catch(err => {
            const message = `ERROR ${err.code} ${err.message}`;

            ToastsService.addToast(message);
        });
    }
}
