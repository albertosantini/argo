"use strict";

// Inspired by http://bl.ocks.org/vicapow/9904319
(function () {
    angular
        .module("argo")
        .directive("argoSl", argoSl);

    argoSl.$inject = [];
    function argoSl() {
        var data = {},
            directive = {
                restrict: "E",
                link: link,
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

            scope.$watch("data", function (quote) {
                redraw(quote);
            });

            function redraw(quote) {
                var svg = d3.select(element[0]),
                    node = svg.node(),
                    instrument = scope.instrument,
                    w = node.clientWidth,
                    h = getComputedStyle(node)["font-size"].replace("px", ""),
                    min,
                    max,
                    x,
                    y;

                svg.selectAll("*").remove();

                if (!data[instrument]) {
                    data[instrument] = [];
                }

                data[instrument].push(
                    (parseFloat(quote.bid) +
                        parseFloat(quote.ask)) / 2);

                if (data[instrument].length > scope.length) {
                    data[instrument].shift();
                }

                if (data[instrument][0] > data[instrument].slice(-1)) {
                    node.style.stroke = "red";
                } else {
                    node.style.stroke = "green";
                }
                node.style.height = h;

                min = d3.min(data[instrument]);
                max = d3.max(data[instrument]);

                x = d3.scaleLinear()
                    .domain([0, data[instrument].length - 1]).range([0, w]);
                y = d3.scaleLinear()
                    .domain([min, max]).range([h, 0]);

                svg.append("path")
                    .attr("d", "M" + data[instrument].map(function (d, i) {
                        return [x(i), y(d)];
                    }).join("L"));
            }
        }
    }
}());
