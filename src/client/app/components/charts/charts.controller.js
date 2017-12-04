import Introspected from "introspected";

import { AccountsService } from "../account/accounts.service";
import { ChartsService } from "./charts.service";
import { OrderDialogComponent } from "../order-dialog/order-dialog.component";
import { QuotesService } from "../quotes/quotes.service";
import { Util } from "../../util";

import { TradesService } from "../trades/trades.service";

export class ChartsController {
    constructor(render, template) {
        const events = (e, payload) => Util.handleEvent(this, e, payload);

        this.state = Introspected({
            candles: { csv: "" },
            account: AccountsService.getAccount(),
            selectedGranularity: "M5",
            selectedInstrument: "EUR_USD",
            granularities: [
                "S5",
                "S10",
                "S15",
                "S30",
                "M1",
                "M2",
                "M3",
                "M4",
                "M5",
                "M10",
                "M15",
                "M30",
                "H1",
                "H2",
                "H3",
                "H4",
                "H6",
                "H8",
                "H12",
                "D",
                "W",
                "M"
            ],
            orderModalIsOpen: false
        }, state => template.update(render, state, events));

        this.state.orderInfo = {
            side: "buy",
            selectedInstrument: this.state.selectedInstrument,
            instruments: this.state.account.streamingInstruments,
            type: "MARKET",
            units: "",
            quote: "",
            step: 1,
            expires: [
                { label: "1 Hour", value: 60 * 60 * 1000 },
                { label: "2 Hours", value: 2 * 60 * 60 * 1000 },
                { label: "3 Hours", value: 3 * 60 * 60 * 1000 },
                { label: "4 Hours", value: 4 * 60 * 60 * 1000 },
                { label: "5 Hours", value: 5 * 60 * 60 * 1000 },
                { label: "6 Hours", value: 6 * 60 * 60 * 1000 },
                { label: "8 Hours", value: 8 * 60 * 60 * 1000 },
                { label: "12 Hours", value: 12 * 60 * 60 * 1000 },
                { label: "18 Hours", value: 18 * 60 * 60 * 1000 },
                { label: "1 Day", value: 60 * 60 * 24 * 1000 },
                { label: "2 Days", value: 2 * 60 * 60 * 24 * 1000 },
                { label: "1 Week", value: 7 * 60 * 60 * 24 * 1000 },
                { label: "1 Month", value: 30 * 60 * 60 * 24 * 1000 },
                { label: "2 Months", value: 60 * 60 * 60 * 24 * 1000 },
                { label: "3 Months", value: 90 * 60 * 60 * 24 * 1000 }
            ],
            selectedExpire: 604800000, // 1 week
            measure: "price",
            isLowerBound: false,
            isUpperBound: false,
            isTakeProfit: false,
            isStopLoss: false,
            isTrailingStop: false
        };

        this.chartsService = new ChartsService(this.state.candles);

        this.state.ohlcInfo = {
            data: this.state.candles.csv,
            feed: "",
            trades: ""
        };

        Introspected.observe(QuotesService.getQuotes(), state => {
            if (Object.keys(state).length) {
                this.state.ohlcInfo.feed = JSON.stringify(state.quotes[this.state.selectedInstrument]);
            }
        });

        Introspected.observe(TradesService.getTrades(), state => {
            if (Object.keys(state.trades).length) {
                this.state.ohlcInfo.trades = JSON.stringify(state.trades.value);
            }
        });

        this.onChartInstrumentChange(null, {
            instrument: this.state.selectedInstrument,
            granularity: this.state.selectedGranularity
        });

        OrderDialogComponent.bootstrap(this.state);
    }

    onChartInstrumentChange(e, { instrument, granularity }) {
        this.state.selectedInstrument = instrument;
        this.state.selectedGranularity = granularity;

        ChartsService.getHistQuotes({
            instrument,
            granularity
        }).then(() => {
            this.state.ohlcInfo.data = this.state.candles.csv;
        });
    }

    onChartGranularityChange(e, { instrument, granularity }) {
        this.onChartInstrumentChange(e, { instrument, granularity });
    }

    openOrderDialog(side) {
        Object.assign(this.state.orderInfo, {
            side,
            selectedInstrument: this.state.selectedInstrument,
            instruments: this.state.account.streamingInstruments
        });

        this.state.orderModalIsOpen = true;
    }

    onOpenOrderDialogBuyClick() {
        this.openOrderDialog("buy");
    }

    onOpenOrderDialogSellClick() {
        this.openOrderDialog("sell");
    }
}
