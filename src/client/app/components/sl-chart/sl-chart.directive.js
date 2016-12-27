"use strict";

// Inspired by http://bl.ocks.org/vicapow/9904319
{
    angular
        .module("components.sl-chart")
        .directive("slChart", slChart);

    slChart.$inject = [];
    function slChart() {
        const data = {},
            directive = {
                restrict: "E",
                link,
                scope: {
                    instrument: "=",
                    data: "=",
                    length: "="
                },
                replace: true,
                template: "<svg class='sl'></svg>",
                transclude: true
            };

        return directive;

        function link(scope, element) {

            scope.$watch("data", quote => {
                redraw(quote);
            });

            function redraw(quote) {
                const svg = d3.select(element[0]),
                    node = svg.node(),
                    instrument = scope.instrument,
                    w = node.clientWidth,
                    h = getComputedStyle(node)["font-size"].replace("px", "");

                svg.selectAll("*").remove();

                if (!data[instrument]) {
                    data[instrument] = [];
                }

                data[instrument].push(
                    (parseFloat(quote.bid) +
                        parseFloat(quote.ask)) / 2);

                data[instrument] = data[instrument].slice(-scope.length);

                if (data[instrument][0] > data[instrument].slice(-1)) {
                    node.style.stroke = "red";
                } else {
                    node.style.stroke = "green";
                }
                node.style.height = `${h}px`;

                const min = d3.min(data[instrument]);
                const max = d3.max(data[instrument]);

                const x = d3.scaleLinear()
                    .domain([0, data[instrument].length - 1]).range([0, w]);
                const y = d3.scaleLinear()
                    .domain([min, max]).range([h, 0]);

                const paths = data[instrument]
                    .map((d, i) => [x(i), y(d)])
                    .join("L");

                svg.append("path").attr("d", `M${paths}`);
            }
        }
    }
}
