import * as d3 from "d3";
import hyperHTML from "hyperHTML";

export class SlChartTemplate {

    static update(render) {
        return render`${hyperHTML.wire(render, "svg")`
            <svg class="sl mw3"></svg>`
        }`;
    }

    // Inspired by http://bl.ocks.org/vicapow/9904319
    static redraw(state) {
        const instrument = state.instrument,
            quote = instrument && state.quotes[instrument],
            svg = d3.select(`td > [data-instrument="${instrument}"] > svg`),
            node = svg.node(),
            w = node && node.clientWidth || 64,
            h = node && getComputedStyle(node)["font-size"].replace("px", "");

        if (!node) {
            return;
        }
        node.style.height = `${h}px`;

        const bid = parseFloat(quote.bid);
        const ask = parseFloat(quote.ask);

        if (isNaN(bid) || isNaN(ask)) {
            return;
        }
        const middle = (bid + ask) / 2;

        svg.selectAll("*").remove();

        if (!SlChartTemplate.data[instrument]) {
            SlChartTemplate.data[instrument] = [];
        }

        SlChartTemplate.data[instrument].push(middle);
        SlChartTemplate.data[instrument] =
            SlChartTemplate.data[instrument].slice(-state.length);

        const data = SlChartTemplate.data[instrument];
        const firstPoint = data[0];
        const lastPoint = data.slice(-1);

        if (firstPoint > lastPoint) {
            node.style.stroke = "red";
        } else {
            node.style.stroke = "green";
        }

        const min = d3.min(data);
        const max = d3.max(data);

        const x = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([0, w]);
        const y = d3.scaleLinear()
            .domain([+min, +max]).range([h, 0]);

        const paths = data
            .map((d, i) => [x(i), y(d)])
            .join("L");

        svg.append("path").attr("d", `M${paths}`);
    }
}

SlChartTemplate.data = {};
