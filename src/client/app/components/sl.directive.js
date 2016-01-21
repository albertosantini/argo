"use strict";

// From http://bl.ocks.org/vicapow/9904319
//
// Example
// <argo-sl style="stroke: red; width: 2em" data="[10, 40, 20, 50, 80]"></sl>

(function () {
    angular
        .module("argo")
        .directive("argoSl", argoSl);

    argoSl.$inject = [];
    function argoSl() {
        var directive = {
            restrict: "E",
            link: link,
            replace: true,
            template: "<svg class='sl'></svg>",
            transclude: true
        };

        return directive;

        function link(scope, element, attrs) {
            var svg = d3.select(element[0]);

            var data = angular.fromJson(attrs.data);
            var min = angular.isDefined(attrs.min) ? attrs.min : d3.min(data);
            var max = angular.isDefined(attrs.max) ? attrs.max : d3.max(data);
            var r = attrs.r || 0;

            var m = r;
            var w = svg.node().clientWidth;
            var h = getComputedStyle(svg.node())["font-size"].replace("px", "");

            var x = d3.scale.linear()
                .domain([0, data.length - 1]).range([m, w - m]);
            var y = d3.scale.linear()
                .domain([min, max]).range([h - m, m]);

            svg.attr({
                width: w,
                height: h
            });

            svg.append("path").data(data)
                .attr("d", "M" + data.map(function (d, i) {
                    return [x(i), y(d)];
                }).join("L"));

            svg.selectAll("circle").data(data).enter().append("circle")
                .attr("r", r)
                .attr("cx", function (d, i) {
                    return x(i);
                })
                .attr("cy", function (d) {
                    return y(d);
                });
        }
    }
}());
