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
                data: "=",
                feed: "="
            },
            link: link
        };

        return directive;

        function link(scope, element) {
            var lastHistUpdate;

            scope.$watch("data", function (data) {
                if (data && data.length > 0) {
                    drawChart(element[0], data);

                    lastHistUpdate = getLastHistUpdate("M5");
                    console.log("last update", new Date());
                }
            });

            scope.$watch("feed", function (feed) {
                var tick = feed.EUR_USD,
                    nextHistUpdate = getLastHistUpdate("M5", tick);

                if (tick && lastHistUpdate !== nextHistUpdate) {
                    console.log("need update", new Date());
                    lastHistUpdate = nextHistUpdate;
                }

                // console.log(feed);
            }, true);

            function getLastHistUpdate(granularity, tick) {
                var time = tick && tick.time,
                    now = time ? new Date(time) : new Date(),
                    value;

                if (granularity === "M5") {
                    value = Math.floor(now.getMinutes() / 5);
                }

                return value;
            }


        }
    }

    function drawChart(el, data) {
        var margin = {
                top: 0,
                right: 20,
                bottom: 30,
                left: 75
            },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = techan.scale.financetime()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var yVolume = d3.scale.linear()
            .range([y(0), y(0.2)]);

        var ohlc = techan.plot.ohlc()
            .xScale(x)
            .yScale(y);

        var sma0 = techan.plot.sma()
            .xScale(x)
            .yScale(y);

        var sma0Calculator = techan.indicator.sma()
            .period(10);

        var sma1 = techan.plot.sma()
            .xScale(x)
            .yScale(y);

        var sma1Calculator = techan.indicator.sma()
            .period(20);

        var volume = techan.plot.volume()
            .accessor(ohlc.accessor())
            .xScale(x)
            .yScale(yVolume);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var volumeAxis = d3.svg.axis()
            .scale(yVolume)
            .orient("right")
            .ticks(3)
            .tickFormat(d3.format(",.3s"));

        var timeAnnotation = techan.plot.axisannotation()
            .axis(xAxis)
            .format(d3.time.format("%Y-%m-%d %H:%M"))
            .width(80)
            .translate([0, height]);

        var ohlcAnnotation = techan.plot.axisannotation()
            .axis(yAxis)
            .format(d3.format(",.4fs"));

        var volumeAnnotation = techan.plot.axisannotation()
            .axis(volumeAxis)
            .width(35);

        var crosshair = techan.plot.crosshair()
            .xScale(x)
            .yScale(y)
            .xAnnotation(timeAnnotation)
            .yAnnotation([ohlcAnnotation, volumeAnnotation]);

        var svg = d3.select(el).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        var defs = svg.append("defs");

        svg = svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        defs
            .append("clipPath")
                .attr("id", "ohlcClip")
            .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height);

        var ohlcSelection = svg.append("g")
            .attr("class", "ohlc")
            .attr("transform", "translate(0,0)");

        ohlcSelection.append("g")
            .attr("class", "volume")
            .attr("clip-path", "url(#ohlcClip)");

        ohlcSelection.append("g")
            .attr("class", "candlestick")
            .attr("clip-path", "url(#ohlcClip)");

        ohlcSelection.append("g")
            .attr("class", "indicator sma ma-0")
            .attr("clip-path", "url(#ohlcClip)");

        ohlcSelection.append("g")
            .attr("class", "indicator sma ma-1")
            .attr("clip-path", "url(#ohlcClip)");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

        svg
            .append("g")
                .attr("class", "y axis")
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price (EUR_USD / M5)");

        svg.append("g")
            .attr("class", "volume axis");

        svg.append("g")
            .attr("class", "crosshair ohlc");

        data = d3.csv.parse(data).map(function (d) {
            return {
                date: new Date(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
                volume: +d.Volume
            };
        });

        svg.select("g.candlestick").datum(data);
        svg.select("g.sma.ma-0").datum(sma0Calculator(data));
        svg.select("g.sma.ma-1").datum(sma1Calculator(data));
        svg.select("g.volume").datum(data);

        redraw();

        function refreshIndicator(selection, indicator, data2) {
            var datum = selection.datum();

            // Some trickery to remove old and insert new without changing array
            // reference, so no need to update __data__ in the DOM
            datum.splice.apply(datum, [0, datum.length].concat(data2));
            selection.call(indicator);
        }

        function redraw() {
            var accessor = ohlc.accessor();

            x.domain(data.map(accessor.d));
            // Show only 150 points on the plot
            x.zoomable().domain([data.length - 130, data.length]);

            // Update y scale min max, only on viewable zoomable.domain()
            y.domain(techan.scale.plot.ohlc(
                data.slice(data.length - 130, data.length)).domain());
            yVolume.domain(techan.scale.plot.volume(
                data.slice(data.length - 130, data.length)).domain());

            // FIX: no idea because throws sometimes an exception (about date)
            // svg.select("g.x.axis").call(xAxis);
            svg.select("g.y.axis").call(yAxis);
            svg.select("g.volume.axis").call(volumeAxis);

            svg.select("g.candlestick").call(ohlc);
            // Recalculate indicators and update the SAME array and
            // redraw moving average
            refreshIndicator(svg.select("g.sma.ma-0"), sma0,
                sma0Calculator(data));
            refreshIndicator(svg.select("g.sma.ma-1"), sma1,
                sma1Calculator(data));

            svg.select("g.volume").call(volume);

            svg.select("g.crosshair.ohlc").call(crosshair);

            // Set next timer expiry
            // setTimeout(function () {
            //     if (feed.length) {
            //         // Simulate a daily feed
            //         data.push(feed.shift());
            //     } else {
            //         // Simulate intra day updates when no feed is left
            //         var last = data[data.length - 1];
            //         // Last must be between high and low
            //         last.close = Math.round(((last.high - last.low) *
            //             Math.random()) * 10) / 10 + last.low;
            //     }

            //     redraw();
            // }, (Math.random() * 1000) + 400);
            // Randomly pick an interval to update the chart
        }

    }

}());
