export class SlChartTemplate {

    static redraw(state) {
        const instrument = state.instrument;
        const quote = instrument && state.quotes[instrument];
        const node = document.querySelector(`td > [data-instrument="${instrument}"] > svg`);
        const w = node && node.clientWidth || 64;
        const h = node && getComputedStyle(node)["font-size"].replace("px", "");

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

        if (node.firstChild) {
            node.removeChild(node.firstChild);
        }

        if (!SlChartTemplate.data[instrument]) {
            SlChartTemplate.data[instrument] = [];
        }

        SlChartTemplate.data[instrument].push(middle);
        SlChartTemplate.data[instrument] =
            SlChartTemplate.data[instrument].slice(-state.length);

        const data = SlChartTemplate.data[instrument];
        const firstPoint = data[0];
        const lastPoint = data.slice(-1);

        node.style.stroke = firstPoint > lastPoint ? "red" : "green";

        const min = Math.min(...data);
        const max = Math.max(...data);

        const paths = data
            .map((d, i) => SlChartTemplate.normalize({
                domainX: {
                    min: 0,
                    max: data.length - 1
                },
                rangeX: {
                    min: 0,
                    max: w
                },
                domainY: {
                    min,
                    max
                },
                rangeY: {
                    min: h,
                    max: 0
                },
                i,
                d
            }))
            .join("L");

        const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

        svgPath.setAttribute("d", `M${paths}`);
        node.appendChild(svgPath);
    }

    static normalize({
        domainX = {
            min: 0,
            max: 1
        },
        rangeX = {
            min: 0,
            max: 1
        },
        domainY = {
            min: 0,
            max: 1
        },
        rangeY = {
            min: 0,
            max: 1
        },
        i = 1,
        d = 1
    }) {
        const newX = (i - domainX.min) / (domainX.max - domainX.min) * rangeX.max;
        const newY = rangeY.min - (d - domainY.min) / (domainY.max - domainY.min) * rangeY.min;

        return [newX, newY];
    }
}

SlChartTemplate.data = {};
