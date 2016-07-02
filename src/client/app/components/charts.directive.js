"use strict";

(function () {
    angular
        .module("argo")
        .directive("argoCharts", argoCharts);

    argoCharts.$inject = [];
    function argoCharts() {
        var directive = {
            restrict: "E",
            scope: {
                instrument: "=",
                granularity: "=",
                data: "=",
                feed: "=",
                trades: "="
            },
            link: link
        };

        return directive;

        function link(scope, element) {
            var myInstrument,
                myGranularity,
                data,
                lastHistUpdate,
                lastData,
                lastClose,
                feedVolume = 0,
                refreshChart;

            scope.$watch("data", function (csv) {
                if (csv && csv.length > 0) {
                    myInstrument = scope.instrument;
                    myGranularity = scope.granularity;

                    data = d3.csvParse(csv).map(function (d) {
                        return {
                            date: new Date(d.Date),
                            o: +d.Open,
                            h: +d.High,
                            l: +d.Low,
                            c: +d.Close,
                            v: +d.Volume
                        };
                    });
                    data = data.slice(data.length - 130, data.length);

                    refreshChart = ohlcChart(element[0], data);

                    lastData = data && data[data.length - 1];
                    lastClose = lastData.c;
                    feedVolume = lastData.v;
                    lastHistUpdate = getLastHistUpdate(myGranularity);
                }
            });

            scope.$watch("feed", function (feed) {
                var tick = feed[myInstrument],
                    nextHistUpdate = getLastHistUpdate(myGranularity, tick),
                    midPrice;

                if (tick && data && lastHistUpdate !== nextHistUpdate) {
                    data.shift();
                    midPrice = (tick.bid + tick.ask) / 2;
                    feedVolume = 0;
                    data.push({
                        o: midPrice,
                        c: midPrice,
                        h: midPrice,
                        l: midPrice,
                        date: new Date(nextHistUpdate),
                        v: feedVolume
                    });

                    lastHistUpdate = nextHistUpdate;
                    refreshChart(true);
                }

                if (tick && data) {

                    if (lastData.c !== lastClose) {
                        feedVolume += 1;
                    }

                    midPrice = (tick.bid + tick.ask) / 2;

                    lastData = data && data[data.length - 1];
                    lastClose = lastData.c;
                    lastData.c = midPrice;
                    lastData.v = feedVolume;

                    if (lastData.c > lastData.h) {
                        lastData.h = lastData.c;
                    }

                    if (lastData.c < lastData.l) {
                        lastData.l = lastData.c;
                    }

                    refreshChart(false);
                }

            }, true);

            function getLastHistUpdate(granularity, tick) {
                var time = tick && tick.time,
                    now = time ? new Date(time) : new Date(),
                    coeff;

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

                return Math.floor(now / (coeff)) * coeff;
            }

            function ohlcChart(el, myData) {
                var margin = {
                        top: 0,
                        right: 60,
                        bottom: 30,
                        left: 90
                    },
                    width = 960 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom,
                    svg;

                d3.select(el).select("svg").remove();
                svg = d3.select(el).append("svg")
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("width", width + margin.right + margin.left)
                    .append("g")
                    .attr("transform", "translate(" +
                        margin.left + "," + margin.top + ")");

                redraw(true);

                function redraw(isShiftingBars) {
                    var ocWidth = 3,
                        bars,
                        x,
                        xAxis,
                        y,
                        yAxis;

                    svg.selectAll(".grid").remove();
                    svg.selectAll(".x.axis").remove();
                    svg.selectAll(".y.axis").remove();
                    if (isShiftingBars) {
                        svg.selectAll(".bar").remove();
                    } else {
                        svg.select(".lastBar").remove();
                    }

                    x = d3.scaleLinear()
                            .range([0, width]).domain([0, myData.length]);

                    y = d3.scaleLinear().range([height, 0]).domain([
                        (d3.min(myData, function (d) {
                            return d.l;
                        })),
                        (d3.max(myData, function (d) {
                            return d.h;
                        }))
                    ]);

                    xAxis = function () {
                        var xTicks = d3.scaleTime().range([0, width]).domain([
                            myData[0].date, myData[myData.length - 1].date
                        ]);

                        return d3.axisBottom(xTicks);
                    };

                    yAxis = function () {
                        return d3.axisRight(y);
                    };

                    svg.append("g").attr("class", "grid")
                        .call(xAxis().tickSize(height, 0, 0).tickFormat(""));

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0, " + height + ")")
                        .call(xAxis());

                    svg.append("g").attr("class", "grid")
                        .call(yAxis().tickSize(width, 0, 0).tickFormat(""));

                    svg.append("g").attr("class", "y axis")
                        .attr("transform", "translate(" + width + ", 0)")
                        .call(yAxis());

                    bars = svg.selectAll(".bar").data(myData)
                        .enter().append("g")
                        .attr("class", function (d, i) {
                            var lastBar = i === myData.length - 1,
                                attr = "bar " + (d.c > d.o ? "green" : "red");

                            attr += lastBar ? " lastBar" : "";

                            return attr;
                        });

                    bars.append("path").attr("class", "path hl-line")
                        .attr("d", function (d, i) {
                            return "M" + x(i) + "," + y(d.h) +
                                " L" + x(i) + "," + y(d.l);
                        });

                    bars.append("path").attr("class", "path c-tick")
                        .attr("d", function (d, i) {
                            return "M" + x(i) + "," + y(d.c) +
                                " L" + (x(i) + ocWidth) + "," + y(d.c);
                        });

                    bars.append("path").attr("class", "path o-tick")
                        .attr("d", function (d, i) {
                            return "M" + (x(i) - ocWidth) + "," + y(d.o) +
                                " L" + x(i) + "," + y(d.o);
                        });

                    svg.append("g")
                            .attr("class", "y axis")
                        .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".71em")
                            .style("font-weight", "bold")
                            .style("text-anchor", "end")
                            .text("Price (" +
                                myInstrument + " / " + myGranularity + ")");
                }

                return redraw;
            }

        }
    }

}());
