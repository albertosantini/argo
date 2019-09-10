import * as d3 from "d3";
import * as fc from "d3fc";

export class OhlcChartTemplate {

    static redrawData(state) {
        if (!state.data) {
            return;
        }

        const myState = OhlcChartTemplate.state;
        const chartEl = document.querySelector("ohlc-chart");

        myState.myInstrument = state.instrument;
        myState.myGranularity = state.granularity;
        myState.myTrades = state.trades;

        myState.refreshChart = OhlcChartTemplate.drawChart(chartEl, state.data);

        myState.lastData = myState.data[myState.data.length - 1];
        myState.lastClose = myState.lastData.close;
        myState.feedVolume = myState.lastData.volume;
        myState.lastHistUpdate = OhlcChartTemplate.getLastHistUpdate(myState.myGranularity);
    }

    static redrawFeed(state) {
        const myState = OhlcChartTemplate.state;
        const tick = state.feed;

        myState.myTrades = state.trades;
        myState.nextHistUpdate = OhlcChartTemplate.getLastHistUpdate(myState.myGranularity, tick);

        let midPrice;

        if (tick.ask && tick.bid && myState.data && myState.lastHistUpdate !== myState.nextHistUpdate) {
            myState.data.shift();
            tick.bid = parseFloat(tick.bid);
            tick.ask = parseFloat(tick.ask);
            midPrice = (tick.bid + tick.ask) / 2;
            myState.feedVolume = 0;
            myState.data.push({
                open: midPrice,
                close: midPrice,
                high: midPrice,
                low: midPrice,
                date: new Date(myState.nextHistUpdate),
                volume: myState.feedVolume
            });

            myState.lastHistUpdate = myState.nextHistUpdate;
        }

        if (tick.ask && tick.bid && myState.data) {
            if (myState.lastData.close !== myState.lastClose) {
                myState.feedVolume += 1;
            }

            tick.bid = parseFloat(tick.bid);
            tick.ask = parseFloat(tick.ask);
            midPrice = (tick.bid + tick.ask) / 2;

            myState.lastData = myState.data && myState.data[myState.data.length - 1];
            myState.lastClose = myState.lastData.close;
            myState.lastData.close = midPrice;
            myState.lastData.volume = myState.feedVolume;

            if (myState.lastData.close > myState.lastData.high) {
                myState.lastData.high = myState.lastData.close;
            }

            if (myState.lastData.close < myState.lastData.low) {
                myState.lastData.low = myState.lastData.close;
            }

            myState.refreshChart();
        }
    }

    static getLastHistUpdate(granularity, tick) {
        const time = tick && tick.time,
            now = time ? new Date(time) : new Date();

        let coeff;

        if (granularity === "S5") {
            coeff = 1000 * 5;
        } else if (granularity === "S10") {
            coeff = 1000 * 10;
        } else if (granularity === "S15") {
            coeff = 1000 * 15;
        } else if (granularity === "S30") {
            coeff = 1000 * 30;
        } else if (granularity === "M1") {
            coeff = 1000 * 60;
        } else if (granularity === "M2") {
            coeff = 1000 * 60 * 2;
        } else if (granularity === "M3") {
            coeff = 1000 * 60 * 3;
        } else if (granularity === "M4") {
            coeff = 1000 * 60 * 4;
        } else if (granularity === "M5") {
            coeff = 1000 * 60 * 5;
        } else if (granularity === "M10") {
            coeff = 1000 * 60 * 10;
        } else if (granularity === "M15") {
            coeff = 1000 * 60 * 15;
        } else if (granularity === "M30") {
            coeff = 1000 * 60 * 30;
        } else if (granularity === "H1") {
            coeff = 1000 * 60 * 60;
        } else if (granularity === "H2") {
            coeff = 1000 * 60 * 60 * 2;
        } else if (granularity === "H3") {
            coeff = 1000 * 60 * 60 * 3;
        } else if (granularity === "H4") {
            coeff = 1000 * 60 * 60 * 4;
        } else if (granularity === "H6") {
            coeff = 1000 * 60 * 60 * 6;
        } else if (granularity === "H8") {
            coeff = 1000 * 60 * 60 * 8;
        } else if (granularity === "H12") {
            coeff = 1000 * 60 * 60 * 12;
        } else {

            // for D / W / M
            coeff = 1000 * 60 * 60 * 12;
        }

        return Math.floor(+now / (coeff)) * coeff;
    }

    static drawChart(el, csv) {
        const myState = OhlcChartTemplate.state;

        myState.data = d3.csvParse(csv).map(
            d => {
                const date = isNaN(Date.parse(d.Date))
                    ? new Date(+d.Date * 1000) : new Date(d.Date);

                return {
                    date,
                    open: +d.Open,
                    high: +d.High,
                    low: +d.Low,
                    close: +d.Close,
                    volume: +d.Volume
                };
            }
        );


        redraw();

        function redraw() {
            const data = myState.data
                .slice(myState.data.length - 130, myState.data.length);

            const myTrades = myState.myTrades.filter(
                trade => trade.instrument === myState.myInstrument
            ).map(
                trade => ({
                    date: new Date(trade.openTime),
                    type: trade.currentUnits > 0 ? "buy" : "sell",
                    price: trade.price
                })
            );

            data.forEach((item, itemIndex) => {
                const barDate = item.date.getTime();

                if (item.trades) {
                    delete item.trades;
                }

                myTrades.forEach((trade, tradeIndex) => {
                    const tradeDate = OhlcChartTemplate.getLastHistUpdate(myState.myGranularity, {
                        time: trade.date.getTime()
                    });

                    if (tradeDate === barDate) {
                        if (!data[itemIndex].trades) {
                            data[itemIndex].trades = [];
                        }
                        data[itemIndex].trades.push(trade);
                        myTrades.splice(tradeIndex, 1);
                    }
                });
            });

            const ohlcSeries = fc
                .seriesSvgOhlc();

            const tradesSeries = fc
                .seriesSvgPoint()
                .crossValue(d => d.trades && d.trades[0].date)
                .mainValue(d => d.trades && d.trades[0].price)
                .decorate(sel => {
                    sel.enter()
                        .attr("fill", d => {
                            const color = d.trades && d.trades[0].type === "buy" ? "#72D5FF" : "#F3C671";

                            return color;
                        });
                });

            const xScale = fc
                .scaleDiscontinuous(d3.scaleTime())
                .discontinuityProvider(fc.discontinuitySkipWeekends());
            const xExtent = fc
                .extentDate()
                .accessors([d => d.date])
                .pad([0, 0.01]);
            const yExtent = fc
                .extentLinear()
                .accessors([d => d.high, d => d.low])
                .pad([0, 0.01]);
            const volumeExtent = fc
                .extentLinear()
                .include([0])
                .pad([0, 4])
                .accessors([d => d.volume]);
            const volumeDomain = volumeExtent(data);
            const volumeToPriceScale = d3
                .scaleLinear()
                .domain(volumeDomain)
                .range(yExtent(data));
            const volumeSeries = fc
                .seriesSvgBar()
                .bandwidth(4)
                .crossValue(d => d.date)
                .mainValue(d => volumeToPriceScale(d.volume))
                .decorate(sel =>
                    sel
                        .enter()
                        .classed("volume", true));
            const multi = fc
                .seriesSvgMulti()
                .series([ohlcSeries, volumeSeries, tradesSeries]);
            const chart = fc
                .chartSvgCartesian(xScale, d3.scaleLinear())
                .yOrient("right")
                .plotArea(multi);

            chart.xDomain(xExtent(data)).yDomain(yExtent(data));

            d3.select(el).datum(data).call(chart);
        }

        return redraw;
    }

}

OhlcChartTemplate.state = {
    myInstrument: null,
    myGranularity: null,
    myTrades: null,
    data: null,
    refreshChart: null,
    lastHistUpdate: null,
    lastData: null,
    lastClose: null,
    feedVolume: 0
};

// html example for removing d3 dep and using directly svg

// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="utf-8" />
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <title>Page Title</title>
//     <meta name="viewport" content="width=device-width, initial-scale=1">
// </head>
// <body>
//     <svg  xmlns="http://www.w3.org/2000/svg">
//     <svg>
//         <g transform="translate(0, 0) scale(5)" stroke="#c60">
//             <path d="
//                 M0,10 L0,0
//                 M0,1.2827193650480808 L-2.5,1.2827193650480808
//                 M0,8.337675872848251 L2.5,8.337675872848251
//             "></path>
//         </g>
//         <g transform="translate(20, 10) scale(5)" stroke="#000">
//             <path d="
//                 M0,10 L0,0
//                 M0,1.2827193650480808 L-2.5,1.2827193650480808
//                 M0,8.337675872848251 L2.5,8.337675872848251
//             "></path>
//         </g>
//     </svg>

// </body>
// </html>
