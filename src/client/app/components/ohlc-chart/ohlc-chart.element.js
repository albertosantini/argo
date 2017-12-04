import { Hyper } from "../../util";
import { OhlcChartTemplate } from "./ohlc-chart.template";

class OhlcChartElement extends Hyper {
    static get observedAttributes() {
        return ["data-data", "data-feed", "data-trades"];
    }

    constructor() {
        super();

        OhlcChartElement.state = {
            instrument: this.dataset.instrument,
            granularity: this.dataset.granularity,
            data: "",
            feed: {},
            trades: []
        };
    }

    render() {
        return OhlcChartTemplate.update(this.hyper);
    }

    attributeChangedCallback(name) {
        OhlcChartElement.state.instrument = this.dataset.instrument;
        OhlcChartElement.state.granularity = this.dataset.granularity;
        OhlcChartElement.state.data = this.dataset.data;
        OhlcChartElement.state.feed = this.dataset.feed && JSON.parse(this.dataset.feed);
        OhlcChartElement.state.trades = this.dataset.trades ? JSON.parse(this.dataset.trades) : [];

        if (OhlcChartElement.state.feed && typeof OhlcChartElement.state.feed.ask !== "string") {
            OhlcChartElement.state.feed.ask = "";
        }
        if (OhlcChartElement.state.feed && typeof OhlcChartElement.state.feed.bid !== "string") {
            OhlcChartElement.state.feed.bid = "";
        }

        if (name === "data-data") {
            OhlcChartTemplate.redrawData(OhlcChartElement.state);
        }

        if (name === "data-feed" || name === "data-trades") {
            OhlcChartTemplate.redrawFeed(OhlcChartElement.state);
        }
    }

}
customElements.define("ohlc-chart", OhlcChartElement);

OhlcChartElement.state = null;
