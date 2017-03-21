(function (exports,angular$1,d3,techan) {
'use strict';

angular$1 = 'default' in angular$1 ? angular$1['default'] : angular$1;
techan = 'default' in techan ? techan['default'] : techan;

const rootComponent = {
    templateUrl: "app/root.html"
};

class AppController {
    $onInit() {
        this.tabSelectedIndex = 0;
    }
}
AppController.$inject = [];

const appComponent = {
    templateUrl: "app/common/app.html",
    controller: AppController
};

function appConfig($httpProvider, $locationProvider) {
    const interceptors = $httpProvider.interceptors;

    interceptors.push(["$q", "$rootScope", ($q, $rootScope) => {
        let nLoadings = 0;

        return {
            request(request) {
                nLoadings += 1;

                $rootScope.isLoadingView = true;

                return request;
            },

            response(response) {
                nLoadings -= 1;
                if (nLoadings === 0) {
                    $rootScope.isLoadingView = false;
                }

                return response;
            },

            responseError(response) {
                nLoadings -= 1;
                if (!nLoadings) {
                    $rootScope.isLoadingView = false;
                }

                return $q.reject(response);
            }
        };
    }]);

    $locationProvider.html5Mode(true);
}
appConfig.$inject = ["$httpProvider", "$locationProvider"];

const app = angular$1
    .module("common.app", [])
    .component("app", appComponent)
    .config(appConfig)
    .name;

const common = angular$1
    .module("common", [
        app
    ])
    .name;

class AccountController {
    constructor(AccountService) {
        this.AccountService = AccountService;
    }

    $onInit() {
        this.account = this.AccountService.getAccount();
    }
}
AccountController.$inject = ["AccountsService"];

const accountComponent = {
    templateUrl: "app/components/account/account.html",
    controller: AccountController
};

class AccountsService {
    constructor($http, SessionService) {
        this.$http = $http;
        this.SessionService = SessionService;

        this.account = {};
    }

    getAccount() {
        return this.account;
    }

    refresh() {
        this.SessionService.isLogged().then(credentials => {
            this.getAccounts({
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            });
        });
    }

    getAccounts(data) {
        const environment = data.environment || "practice",
            token = data.token,
            accountId = data.accountId,
            api = accountId ? "/api/account" : "/api/accounts";

        return this.$http.post(api, {
            environment,
            token,
            accountId
        }).then(response => {
            const accounts = response.data.accounts || response.data;

            if (response.data.message) {
                throw response.data.message;
            }

            if (!accounts.length) {
                angular$1.merge(this.account, response.data.account);

                this.account.timestamp = new Date();

                this.account.unrealizedPLPercent =
                    this.account.unrealizedPL / this.account.balance * 100;

                if (!this.account.instruments) {
                    this.$http.post("/api/instruments", {
                        environment,
                        token,
                        accountId
                    }).then(instruments => {
                        this.account.instruments = instruments.data;
                        this.account.pips = {};
                        angular$1.forEach(this.account.instruments, i => {
                            this.account.pips[i.name] =
                                Math.pow(10, i.pipLocation);
                        });
                    });
                }
            }

            return accounts;
        });
    }

    setStreamingInstruments(settings) {
        this.account.streamingInstruments = Object.keys(settings)
            .filter(el => !!settings[el]);

        return this.account.streamingInstruments;
    }
}
AccountsService.$inject = ["$http", "SessionService"];

const account = angular$1
    .module("components.account", [])
    .component("account", accountComponent)
    .service("AccountsService", AccountsService)
    .name;

class ActivityController {
    constructor(ActivityService) {
        this.ActivityService = ActivityService;
    }

    $onInit() {
        this.ActivityService.getActivities().then(activities => {
            this.activities = activities;
        });
    }
}
ActivityController.$inject = ["ActivityService"];

const activityComponent = {
    templateUrl: "app/components/activity/activity.html",
    controller: ActivityController
};

class ActivityService {
    constructor($http, SessionService, AccountsService) {
        this.$http = $http;
        this.SessionService = SessionService;
        this.AccountsService = AccountsService;

        this.activities = [];
    }

    getActivities() {
        const account = this.AccountsService.getAccount(),
            lastTransactionID = account.lastTransactionID;

        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/transactions", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                lastTransactionID
            }).then(transactions => {
                this.activities = transactions.data.reverse();

                return this.activities;
            }).catch(err => err.data)
        );
    }

    addActivity(activity) {
        this.activities.splice(0, 0, {
            id: activity.id,
            type: activity.type,
            instrument: activity.instrument,
            units: activity.units,
            price: activity.price,
            pl: activity.pl,
            accountBalance: activity.accountBalance,
            time: activity.time
        });
    }
}
ActivityService.$inject = ["$http", "SessionService", "AccountsService"];

const activity = angular$1
    .module("components.activity", [])
    .component("activity", activityComponent)
    .service("ActivityService", ActivityService)
    .name;

class ChartsController {
    constructor(ToastsService, AccountsService, ChartsService,
            QuotesService, TradesService) {
        this.ToastsService = ToastsService;
        this.AccountsService = AccountsService;
        this.ChartsService = ChartsService;
        this.QuotesService = QuotesService;
        this.TradesService = TradesService;
    }

    $onInit() {
        this.account = this.AccountsService.getAccount();

        this.selectedInstrument = "EUR_USD";

        this.granularities = [
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
        ];
        this.selectedGranularity = "M5";

        this.feed = this.QuotesService.getQuotes();

        this.trades = this.TradesService.getTrades();

        this.changeChart(this.selectedInstrument, this.selectedGranularity);

        this.orderParams = {
            side: "buy",
            selectedInstrument: this.selectedInstrument,
            instruments: this.account.streamingInstruments
        };
    }

    changeChart(instrument, granularity) {
        this.ChartsService.getHistQuotes({
            instrument,
            granularity
        }).then(candles => {
            this.data = candles;
        }).catch(err => {
            this.ToastsService.addToast(err);
        });
    }


    openOrderDialog(side) {
        angular.extend(this.orderParams, {
            side,
            selectedInstrument: this.selectedInstrument,
            instruments: this.account.streamingInstruments
        });

        this.openOrderModal = true;
    }
}
ChartsController.$inject = [
    "ToastsService", "AccountsService", "ChartsService",
    "QuotesService", "TradesService"
];

const chartsComponent = {
    templateUrl: "app/components/charts/charts.html",
    controller: ChartsController
};

class ChartsService {
    constructor($http, SessionService) {
        this.$http = $http;
        this.SessionService = SessionService;
    }

    getHistQuotes(opt) {
        return this.SessionService.isLogged().then(credentials => {
            const instrument = opt && opt.instrument || "EUR_USD",
                granularity = opt && opt.granularity || "M5",
                count = opt && opt.count || 251,
                dailyAlignment = opt && opt.dailyAlignment || "0";

            return this.$http.post("/api/candles", {
                environment: credentials.environment,
                token: credentials.token,
                instrument,
                granularity,
                count,
                dailyAlignment
            }).then(candles => candles.data)
            .catch(err => err.data);
        });
    }
}
ChartsService.$inject = ["$http", "SessionService"];

const charts = angular$1
    .module("components.charts", [])
    .component("charts", chartsComponent)
    .service("ChartsService", ChartsService)
    .name;

function dualColorDirective() {
    const directive = {
        restrict: "A",
        link
    };

    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.dualColor, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                if (newValue > 0) {
                    element.removeClass("highlight-red");
                    element.addClass("highlight-green");
                }
                if (newValue < 0) {
                    element.removeClass("highlight-green");
                    element.addClass("highlight-red");
                }
            }
        });
    }
}
dualColorDirective.$inject = [];

const dualColor = angular$1
    .module("components.dual-color", [])
    .directive("dualColor", dualColorDirective)
    .name;

class ExposureController {
    constructor(TradesService) {
        this.TradesService = TradesService;
    }

    $onInit() {
        this.exposures = [];

        const trades = this.TradesService.getTrades(),
            exps = {};

        trades.forEach(trade => {
            const legs = trade.instrument.split("_");

            exps[legs[0]] = exps[legs[0]] || 0;
            exps[legs[1]] = exps[legs[1]] || 0;

            exps[legs[0]] += parseInt(trade.currentUnits, 10);
            exps[legs[1]] -= trade.currentUnits * trade.price;
        });

        Object.keys(exps).forEach(exp => {
            const type = exps[exp] > 0;

            this.exposures.push({
                type: type ? "Long" : "Short",
                market: exp,
                units: Math.abs(exps[exp])
            });
        });
    }
}
ExposureController.$inject = ["TradesService"];

const exposureComponent = {
    templateUrl: "app/components/exposure/exposure.html",
    controller: ExposureController
};

const exposure = angular$1
    .module("components.exposure", [])
    .component("exposure", exposureComponent)
    .name;

class HeaderController {
    constructor($window, $rootScope, ToastsService,
            AccountsService, SessionService,
            QuotesService, StreamingService) {
        this.$window = $window;
        this.$rootScope = $rootScope;
        this.ToastsService = ToastsService;
        this.AccountsService = AccountsService;
        this.SessionService = SessionService;
        this.QuotesService = QuotesService;
        this.StreamingService = StreamingService;
    }

    $onInit() {
        this.$rootScope.$watch("isLoadingView", () => {
            this.isLoadingView = this.$rootScope.isLoadingView;
        });
    }

    openTokenDialog() {
        this.openTokenModal = true;
    }

    closeTokenDialog(tokenInfo) {
        this.openTokenModal = false;

        if (tokenInfo) {
            this.token = tokenInfo.token;
            this.environment = tokenInfo.environment;
            this.accountId = tokenInfo.accountId;
            this.instrs = tokenInfo.instrs;
        }
    }

    openSettingsDialog() {
        this.SessionService.isLogged().then(credentials => {
            const allInstrs = this.AccountsService.getAccount().instruments;

            angular$1.forEach(allInstrs, instrument => {
                if (!this.instrs.hasOwnProperty(instrument.name)) {
                    this.instrs[instrument.name] = false;
                }
            });

            this.credentials = credentials;
            this.openSettingsModal = true;
        }).catch(err => {
            if (err) {
                this.ToastsService.addToast(err);
            }
        });
    }

    closeSettingsDialog(settingsInfo) {
        let instruments;

        this.openSettingsModal = false;

        if (settingsInfo) {
            this.$window.localStorage.setItem("argo.instruments",
                angular$1.toJson(settingsInfo));
            instruments = this.AccountsService
                .setStreamingInstruments(settingsInfo);

            this.QuotesService.reset();

            this.StreamingService.startStream({
                environment: this.credentials.environment,
                accessToken: this.credentials.token,
                accountId: this.credentials.accountId,
                instruments
            });
        }
    }

}
HeaderController.$inject = [
    "$window", "$rootScope", "ToastsService",
    "AccountsService", "SessionService",
    "QuotesService", "StreamingService"
];

const headerComponent = {
    templateUrl: "app/components/header/header.html",
    controller: HeaderController
};

const header = angular$1
    .module("components.header", [])
    .component("header", headerComponent)
    .name;

function highlighterDirective($timeout) {
    const directive = {
        restrict: "A",
        link
    };

    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.highlighter, (newValue, oldValue) => {
            let newclass;

            if (newValue !== oldValue) {
                newclass = newValue < oldValue
                    ? "highlight-red" : "highlight-green";

                element.addClass(newclass);

                $timeout(() => {
                    element.removeClass(newclass);
                }, 500);
            }
        });
    }
}
highlighterDirective.$inject = ["$timeout"];

const highlighter = angular$1
    .module("components.highlighter", [])
    .directive("highlighter", highlighterDirective)
    .name;

class NewsController {
    constructor(NewsService) {
        this.NewsService = NewsService;
    }

    $onInit() {
        this.NewsService.getNews().then(news => {
            this.news = news;
        });
    }
}
NewsController.$inject = ["NewsService"];

const newsComponent = {
    templateUrl: "app/components/news/news.html",
    controller: NewsController
};

class NewsService {
    constructor($http, SessionService) {
        this.$http = $http;
        this.SessionService = SessionService;
    }

    getNews() {
        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/calendar", {
                environment: credentials.environment,
                token: credentials.token
            }).then(news => news.data.map(item => {
                item.timestamp = item.timestamp * 1000;

                return item;
            })).catch(err => err.data)
        );
    }
}
NewsService.$inject = ["$http", "SessionService"];

const news = angular$1
    .module("components.news", [])
    .component("news", newsComponent)
    .service("NewsService", NewsService)
    .name;

function ohlcChartDirective() {
    const directive = {
        restrict: "E",
        scope: {
            instrument: "=",
            granularity: "=",
            data: "=",
            feed: "=",
            trades: "="
        },
        link
    };

    return directive;

    function link(scope, element) {
        let myInstrument,
            myGranularity,
            myTrades,
            data,
            refreshChart,
            lastHistUpdate,
            lastData,
            lastClose,
            feedVolume = 0;

        scope.$watch("data", csv => {
            if (csv && csv.length > 0) {
                myInstrument = scope.instrument;
                myGranularity = scope.granularity;

                refreshChart = drawChart(element[0], csv);

                lastData = data && data[data.length - 1];
                lastClose = lastData.close;
                feedVolume = lastData.volume;
                lastHistUpdate = getLastHistUpdate(myGranularity);
            }
        });

        scope.$watch("feed", feed => {
            const tick = feed[myInstrument],
                nextHistUpdate = getLastHistUpdate(myGranularity, tick);

            let midPrice;

            if (tick && data && lastHistUpdate !== nextHistUpdate) {
                data.shift();
                tick.bid = parseFloat(tick.bid);
                tick.ask = parseFloat(tick.ask);
                midPrice = (tick.bid + tick.ask) / 2;
                feedVolume = 0;
                data.push({
                    open: midPrice,
                    close: midPrice,
                    high: midPrice,
                    low: midPrice,
                    date: new Date(nextHistUpdate),
                    volume: feedVolume
                });

                lastHistUpdate = nextHistUpdate;
            }

            if (tick && data) {

                if (lastData.close !== lastClose) {
                    feedVolume += 1;
                }

                tick.bid = parseFloat(tick.bid);
                tick.ask = parseFloat(tick.ask);
                midPrice = (tick.bid + tick.ask) / 2;

                lastData = data && data[data.length - 1];
                lastClose = lastData.close;
                lastData.close = midPrice;
                lastData.volume = feedVolume;

                if (lastData.close > lastData.high) {
                    lastData.high = lastData.close;
                }

                if (lastData.close < lastData.low) {
                    lastData.low = lastData.close;
                }

                refreshChart();
            }

        }, true);

        function getLastHistUpdate(granularity, tick) {
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

            return Math.floor(now / (coeff)) * coeff;
        }

        function drawChart(el, csv) {
            const margin = {
                    top: 0,
                    right: 20,
                    bottom: 30,
                    left: 75
                },
                width = 960 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            const x = techan.scale.financetime()
                .range([0, width]);

            const y = d3.scaleLinear()
                .range([height, 0]);

            const yVolume = d3.scaleLinear()
                .range([y(0), y(0.2)]);

            const ohlc = techan.plot.ohlc()
                .xScale(x)
                .yScale(y);

            const tradearrow = techan.plot.tradearrow()
                .xScale(x)
                .yScale(y)
                .orient(d => {
                    const side = d.type.startsWith("buy") ? "up" : "down";

                    return side;
                });

            const sma0 = techan.plot.sma()
                .xScale(x)
                .yScale(y);

            const sma0Calculator = techan.indicator.sma()
                .period(10);

            const sma1 = techan.plot.sma()
                .xScale(x)
                .yScale(y);

            const sma1Calculator = techan.indicator.sma()
                .period(20);

            const volume = techan.plot.volume()
                .accessor(ohlc.accessor())
                .xScale(x)
                .yScale(yVolume);

            const xAxis = d3.axisBottom(x);

            const yAxis = d3.axisLeft(y);

            const volumeAxis = d3.axisRight(yVolume)
                .ticks(3)
                .tickFormat(d3.format(",.3s"));

            const timeAnnotation = techan.plot.axisannotation()
                .axis(xAxis)
                .orient("bottom")
                .format(d3.timeFormat("%Y-%m-%d %H:%M"))
                .width(80)
                .translate([0, height]);

            const ohlcAnnotation = techan.plot.axisannotation()
                .axis(yAxis)
                .orient("left")
                .format(d3.format(",.4f"));

            const volumeAnnotation = techan.plot.axisannotation()
                .axis(volumeAxis)
                .orient("right")
                .width(35);

            const crosshair = techan.plot.crosshair()
                .xScale(x)
                .yScale(y)
                .xAnnotation(timeAnnotation)
                .yAnnotation([ohlcAnnotation, volumeAnnotation]);

            d3.select(el).select("svg").remove();

            const svg = d3.select(el).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    `translate(${margin.left}, ${margin.top})`);

            const defs = svg.append("defs")
                .append("clipPath")
                    .attr("id", "ohlcClip");

            defs.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height);

            const ohlcSelection = svg.append("g")
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

            ohlcSelection.append("g")
                .attr("class", "tradearrow");

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0, ${height})`);

            svg
                .append("g")
                    .attr("class", "y axis")
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("font-weight", "bold")
                    .style("text-anchor", "end")
                    .text(`Price (${myInstrument} / ${myGranularity})`);

            svg.append("g")
                .attr("class", "volume axis");

            svg.append("g")
                .attr("class", "crosshair ohlc");

            data = d3.csvParse(csv).map(
                d => ({
                    date: new Date(+d.Date * 1000),
                    open: +d.Open,
                    high: +d.High,
                    low: +d.Low,
                    close: +d.Close,
                    volume: +d.Volume
                })
            );

            svg.select("g.candlestick").datum(data);
            svg.select("g.sma.ma-0").datum(sma0Calculator(data));
            svg.select("g.sma.ma-1").datum(sma1Calculator(data));
            svg.select("g.volume").datum(data);

            redraw();

            function redraw() {
                const accessor = ohlc.accessor();

                x.domain(data.map(accessor.d));
                x.zoomable().domain([data.length - 130, data.length]);

                y.domain(techan.scale.plot.ohlc(
                    data.slice(data.length - 130, data.length)).domain());
                yVolume.domain(techan.scale.plot.volume(
                    data.slice(data.length - 130, data.length)).domain());

                svg.select("g.x.axis").call(xAxis);
                svg.select("g.y.axis").call(yAxis);
                svg.select("g.volume.axis").call(volumeAxis);

                svg.select("g.candlestick").datum(data).call(ohlc);
                svg.select("g.tradearrow").remove();
                svg.append("g").attr("class", "tradearrow");
                myTrades = scope.trades.filter(
                    trade => trade.instrument === myInstrument)
                    .map(
                        trade => ({
                            date: new Date(trade.openTime),
                            type: trade.currentUnits > 0 ? "buy" : "sell",
                            price: trade.price
                        })
                    );
                svg.select("g.tradearrow").datum(myTrades).call(tradearrow);

                svg.select("g.sma.ma-0")
                    .datum(sma0Calculator(data)).call(sma0);
                svg.select("g.sma.ma-1")
                    .datum(sma1Calculator(data)).call(sma1);

                svg.select("g.volume").datum(data).call(volume);

                svg.select("g.crosshair.ohlc").call(crosshair);
            }

            return redraw;
        }

    }
}
ohlcChartDirective.$inject = [];

const ohlcChart = angular$1
    .module("components.ohlc-chart", [])
    .directive("ohlcChart", ohlcChartDirective)
    .name;

class OrderDialogController {
    constructor(ToastsService, QuotesService, OrdersService, AccountsService) {
        this.ToastsService = ToastsService;
        this.QuotesService = QuotesService;
        this.OrdersService = OrdersService;
        this.AccountsService = AccountsService;
    }

    $onInit() {
        const account = this.AccountsService.getAccount();

        this.pips = account.pips;

        this.type = "MARKET";
        this.side = this.params.side;
        this.instruments = this.params.instruments;
        this.selectedInstrument = this.params.selectedInstrument;
        this.changeMarket(this.selectedInstrument);
        this.expires = [
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
        ];
        this.selectedExpire = 604800000; // 1 week
        this.measure = "price";
        this.isLowerBound = false;
        this.isUpperBound = false;
        this.isTakeProfit = false;
        this.isStopLoss = false;
        this.isTrailingStop = false;
    }

    changeMarket(instrument) {
        if (!this.pips) {
            return;
        }

        const price = this.QuotesService.getQuotes()[instrument],
            fixed = ((this.pips[this.selectedInstrument].toString())
                .match(/0/g) || []).length;

        this.measure = "price";
        this.step = parseFloat(this.pips[this.selectedInstrument]);
        if (this.side === "buy") {
            this.quote = parseFloat(price && price.ask);
            this.takeProfit = parseFloat((this.quote + this.step * 10)
                .toFixed(fixed));
            this.stopLoss = parseFloat((this.quote - this.step * 10)
                .toFixed(fixed));
        } else {
            this.quote = parseFloat(price && price.bid);
            this.takeProfit = parseFloat((this.quote - this.step * 10)
                .toFixed(fixed));
            this.stopLoss = parseFloat((this.quote + this.step * 10)
                .toFixed(fixed));
        }
        this.lowerBound = parseFloat((this.quote - this.step).toFixed(fixed));
        this.upperBound = parseFloat((this.quote + this.step).toFixed(fixed));
        this.trailingStop = 25;
    }

    changeMeasure(measure) {
        if (measure === "price") {
            this.changeMarket(this.selectedInstrument);
        } else {
            this.lowerBound = 1;
            this.upperBound = 1;
            this.takeProfit = 10;
            this.stopLoss = 10;
            this.trailingStop = 25;
            this.step = 1;
        }
    }

    answer(action) {
        if (action === "close") {
            this.openModal = false;

            return;
        }

        if (!this.pips) {
            this.ToastsService .addToast(`Pips info for ${this.selectedInstrument} not yet available. Retry.`);
            this.openModal = false;

            return;
        }

        this.openModal = false;

        const order = {},
            isBuy = this.side === "buy",
            isMeasurePips = this.measure === "pips";

        this.step = parseFloat(this.pips[this.selectedInstrument]);

        order.instrument = this.selectedInstrument;
        order.units = this.units;
        if (this.units && !isBuy) {
            order.units = `-${order.units}`;
        }

        order.side = this.side;
        order.type = this.type;

        if (order.type === "LIMIT") {
            order.price = this.quote && this.quote.toString();
            order.gtdTime = new Date(Date.now() + this.selectedExpire);
        }

        if (isMeasurePips) {
            if (this.isLowerBound) {
                order.priceBound =
                    parseFloat(this.quote - this.step * this.lowerBound)
                        .toString();
            }
            if (this.isUpperBound) {
                order.priceBound =
                    parseFloat(this.quote + this.step * this.upperBound)
                        .toString();
            }
            if (isBuy) {
                if (this.isTakeProfit) {
                    order.takeProfitOnFill = {};
                    order.takeProfitOnFill.price =
                        parseFloat(this.quote + this.step * this.takeProfit)
                            .toString();
                }
                if (this.isStopLoss) {
                    order.stopLossOnFill = {};
                    order.order.takeProfitOnFill.price =
                        parseFloat(this.quote - this.step * this.stopLoss)
                            .toString();
                }
            } else {
                if (this.isTakeProfit) {
                    order.takeProfitOnFill = {};
                    order.takeProfitOnFill.price =
                        parseFloat(this.quote - this.step * this.takeProfit)
                            .toString();
                }
                if (this.isStopLoss) {
                    order.stopLossOnFill = {};
                    order.order.takeProfitOnFill.price =
                        parseFloat(this.quote + this.step * this.stopLoss)
                            .toString();
                }
            }
        } else {
            if (this.isLowerBound) {
                order.priceBound = this.lowerBound.toString();
            }
            if (this.isUpperBound) {
                order.priceBound = this.upperBound.toString();
            }
            if (this.isTakeProfit) {
                order.takeProfitOnFill = {};
                order.takeProfitOnFill.price = this.takeProfit.toString();
            }
            if (this.isStopLoss) {
                order.stopLossOnFill = {};
                order.stopLossOnFill.price = this.stopLoss.toString();
            }
        }
        if (this.isTrailingStop) {
            order.trailingStopLossOnFill = {};
            order.trailingStopLossOnFill.distance =
                (this.step * this.trailingStop).toString();
        }

        this.OrdersService.putOrder(order).then(transaction => {
            let opened,
                canceled,
                side,
                message;

            if (transaction.message) {
                message = `ERROR ${transaction.message}`;

                this.ToastsService.addToast(message);
            } else if (transaction.errorMessage) {
                message = `ERROR ${transaction.errorMessage}`;

                this.ToastsService.addToast(message);
            } else if (transaction.orderCancelTransaction) {
                canceled = transaction.orderCancelTransaction;

                message = `ERROR ${canceled.reason}`;

                this.ToastsService.addToast(message);
            } else {
                opened = transaction.orderFillTransaction ||
                    transaction.orderFillTransaction ||
                    transaction.orderCreateTransaction;

                side = opened.units > 0 ? "buy" : "sell";
                message = `${side} ` +
                    `${opened.instrument} ` +
                    `#${opened.id} ` +
                    `@${opened.price} ` +
                    `for ${opened.units}`;

                this.ToastsService.addToast(message);
            }
        });
    }
}
OrderDialogController.$inject = ["ToastsService", "QuotesService", "OrdersService", "AccountsService"];

const orderDialogComponent = {
    templateUrl: "app/components/order-dialog/order-dialog.html",
    controller: OrderDialogController,
    bindings: {
        openModal: "=",
        params: "<"
    }
};

const orderDialog = angular$1
    .module("components.order-dialog", [])
    .component("orderDialog", orderDialogComponent)
    .name;

class OrdersController {
    constructor(ToastsService, OrdersService) {
        this.ToastsService = ToastsService;
        this.OrdersService = OrdersService;
    }

    $onInit() {
        this.orders = this.OrdersService.getOrders();

        this.OrdersService.refresh();
    }

    closeOrder(orderId) {
        this.openCloseOrderModal = true;
        this.closingOrderId = orderId;
    }

    closeOrderDialog(answer) {
        this.openCloseOrderModal = false;

        if (!answer) {
            return;
        }

        this.OrdersService.closeOrder(this.closingOrderId).then(order => {
            let message = `Closed #${order.orderCancelTransaction.orderID}`;

            if (order.errorMessage || order.message) {
                message = `ERROR ${order.errorMessage || order.message}`;
            }

            this.ToastsService.addToast(message);
        }).catch(err => {
            const message = `ERROR ${err.code} ${err.message}`;

            this.ToastsService.addToast(message);
        });
    }

}
OrdersController.$inject = ["ToastsService", "OrdersService"];

const ordersComponent = {
    templateUrl: "app/components/orders/orders.html",
    controller: OrdersController
};

class OrdersService {
    constructor($http, SessionService, AccountsService) {
        this.$http = $http;
        this.SessionService = SessionService;
        this.AccountsService = AccountsService;

        this.orders = [];
    }

    getOrders() {
        return this.orders;
    }

    refresh() {
        this.SessionService.isLogged().then(credentials => {
            this.$http.post("/api/orders", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            }).then(res => {
                this.orders.length = 0;
                angular$1.extend(this.orders, res.data);
            });
        });
    }

    putOrder(order) {
        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/order", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                instrument: order.instrument,
                units: order.units,
                side: order.side,
                type: order.type,
                expiry: order.expiry,
                price: order.price,
                priceBound: order.lowerBound || order.upperBound,
                stopLossOnFill: order.stopLossOnFill,
                takeProfitOnFill: order.takeProfitOnFill,
                trailingStopLossOnFill: order.trailingStopLossOnFill
            }).then(trade => trade.data)
            .catch(err => err.data)
        );
    }

    closeOrder(id) {
        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/closeorder", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                id
            }).then(order => order.data)
            .catch(err => err.data)
        );
    }

    updateOrders(tick) {
        const account = this.AccountsService.getAccount(),
            pips = account.pips;

        this.orders.forEach((order, index) => {
            let current;

            if (order.instrument === tick.instrument) {

                if (order.units > 0) {
                    current = tick.ask;
                }
                if (order.units < 0) {
                    current = tick.bid;
                }

                this.orders[index].current = current;
                this.orders[index].distance = (Math.abs(current - order.price) /
                    pips[order.instrument]);
            }
        });
    }
}
OrdersService.$inject = ["$http", "SessionService", "AccountsService"];

const orders = angular$1
    .module("components.orders", [])
    .component("orders", ordersComponent)
    .service("OrdersService", OrdersService)
    .name;

class PluginsController {
    constructor(PluginsService) {
        this.PluginsService = PluginsService;
    }

    $onInit() {
        this.plugins = this.PluginsService.getPlugins();
        this.pluginsInfo = this.PluginsService.getPluginsInfo();

        this.PluginsService.refresh();
    }

    engage() {
        this.PluginsService.engagePlugins(this.plugins);
    }
}
PluginsController.$inject = ["PluginsService"];

const pluginsComponent = {
    templateUrl: "app/components/plugins/plugins.html",
    controller: PluginsController
};

class PluginsService {
    constructor($http, SessionService, AccountsService) {
        this.$http = $http;
        this.SessionService = SessionService;
        this.AccountsService = AccountsService;

        this.plugins = {};
        this.pluginsInfo = {
            count: 0
        };
    }

    getPlugins() {
        return this.plugins;
    }

    getPluginsInfo() {
        return this.pluginsInfo;
    }

    refresh() {
        this.SessionService.isLogged().then(credentials => {
            this.$http.post("/api/plugins", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            }).then(res => {
                let name;

                for (name in this.plugins) {
                    if (this.plugins.hasOwnProperty(name)) {
                        delete this.plugins[name];
                    }
                }
                angular$1.extend(this.plugins, res.data);
                this.pluginsInfo.count = Object.keys(this.plugins).length;

                Object.keys(this.plugins).forEach(key => {
                    if (this.plugins[key] === "enabled") {
                        this.plugins[key] = true;
                    } else {
                        this.plugins[key] = false;
                    }
                });
            });
        });
    }

    engagePlugins(plugs) {
        this.SessionService.isLogged().then(credentials => {
            const account = this.AccountsService.getAccount();

            this.$http.post("/api/engageplugins", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                plugins: plugs,
                config: {
                    pips: account.pips
                }
            });
        });
    }
}
PluginsService.$inject = ["$http", "SessionService", "AccountsService"];

const plugins = angular$1
    .module("components.plugins", [])
    .component("plugins", pluginsComponent)
    .service("PluginsService", PluginsService)
    .name;

class PositionsController {
    constructor(PositionsService) {
        this.PositionsService = PositionsService;
    }

    $onInit() {
        this.PositionsService.getPositions().then(positions => {
            this.positions = positions;
        });
    }
}
PositionsController.$inject = ["PositionsService"];

const positionsComponent = {
    templateUrl: "app/components/positions/positions.html",
    controller: PositionsController
};

class PositionsService {
    constructor($http, SessionService) {
        this.$http = $http;
        this.SessionService = SessionService;
    }

    getPositions() {
        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/positions", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            }).then(positions => {
                const data = [];

                positions.data.forEach(position => {
                    const longUnits = position.long &&
                        parseInt(position.long.units, 10);
                    const shortUnits = position.short &&
                        parseInt(position.short.units, 10);
                    const units = longUnits || shortUnits;
                    const side = units > 0 ? "buy" : "sell";
                    const avgPrice = (longUnits && position.long.averagePrice) ||
                        (shortUnits && position.short.averagePrice);

                    data.push({
                        side,
                        instrument: position.instrument,
                        units,
                        avgPrice
                    });
                });

                return data;
            }).catch(err => err.data)
        );
    }
}
PositionsService.$inject = ["$http", "SessionService"];

const positions = angular$1
    .module("components.positions", [])
    .component("positions", positionsComponent)
    .service("PositionsService", PositionsService)
    .name;

class QuotesController {
    constructor(QuotesService) {
        this.QuotesService = QuotesService;
    }

    $onInit() {
        this.quotes = this.QuotesService.getQuotes();
    }
}
QuotesController.$inject = ["QuotesService"];

const quotesComponent = {
    templateUrl: "app/components/quotes/quotes.html",
    controller: QuotesController
};

class QuotesService {
    constructor(AccountsService) {
        this.AccountsService = AccountsService;

        this.quotes = {};
    }

    getQuotes() {
        return this.quotes;
    }

    updateTick(tick) {
        const account = this.AccountsService.getAccount(),
            streamingInstruments = account.streamingInstruments,
            pips = account.pips,
            instrument = tick.instrument;

        this.quotes[instrument] = {
            time: tick.time,
            ask: tick.ask,
            bid: tick.bid,
            spread: ((tick.ask - tick.bid) / pips[instrument]).toFixed(1)
        };


        if (!angular$1.equals(streamingInstruments, Object.keys(this.quotes))) {
            streamingInstruments.forEach(instr => {
                let temp;

                if (this.quotes.hasOwnProperty(instr)) {
                    temp = this.quotes[instr];
                    delete this.quotes[instr];
                    this.quotes[instr] = temp;
                }
            });
        }
    }

    reset() {
        let key;

        for (key in this.quotes) {
            if (this.quotes.hasOwnProperty(key)) {
                delete this.quotes[key];
            }
        }
    }
}
QuotesService.$inject = ["AccountsService"];

const quotes = angular$1
    .module("components.quotes", [])
    .component("quotes", quotesComponent)
    .service("QuotesService", QuotesService)
    .name;

class SessionService {
    constructor($q) {
        this.deferred = $q.defer();
        this.credentials = {
            environment: null,
            token: null,
            accountId: null
        };
    }

    setCredentials(session) {
        this.credentials.environment = session.environment;
        this.credentials.token = session.token;
        this.credentials.accountId = session.accountId;

        this.deferred.resolve(this.credentials);
    }

    isLogged() {
        return this.deferred.promise;
    }
}
SessionService.$inject = ["$q"];

const session = angular$1
    .module("components.session", [])
    .service("SessionService", SessionService)
    .name;

class SettingsDialogController {
    answer(settingsInfo) {
        this.closeModal({ settingsInfo });
    }
}
SettingsDialogController.$inject = [];

const settingsDialogComponent = {
    templateUrl: "app/components/settings-dialog/settings-dialog.html",
    controller: SettingsDialogController,
    bindings: {
        openModal: "=",
        closeModal: "&",
        instruments: "<"
    }
};

const settingsDialog = angular$1
    .module("components.settings-dialog", [])
    .component("settingsDialog", settingsDialogComponent)
    .name;

// Inspired by http://bl.ocks.org/vicapow/9904319
function slChartDirective() {
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

            const min$$1 = d3.min(data[instrument]);
            const max$$1 = d3.max(data[instrument]);

            const x = d3.scaleLinear()
                .domain([0, data[instrument].length - 1]).range([0, w]);
            const y = d3.scaleLinear()
                .domain([min$$1, max$$1]).range([h, 0]);

            const paths = data[instrument]
                .map((d, i) => [x(i), y(d)])
                .join("L");

            svg.append("path").attr("d", `M${paths}`);
        }
    }
}
slChartDirective.$inject = [];

const slChart = angular$1
    .module("components.sl-chart", [])
    .directive("slChart", slChartDirective)
    .name;

class StreamingService {
    constructor($timeout, $http, ToastsService,
            QuotesService, ActivityService, TradesService,
            OrdersService, AccountsService, PluginsService) {
        this.$timeout = $timeout;
        this.$http = $http;
        this.ToastsService = ToastsService;
        this.QuotesService = QuotesService;
        this.ActivityService = ActivityService;
        this.TradesService = TradesService;
        this.OrdersService = OrdersService;
        this.AccountsService = AccountsService;
        this.PluginsService = PluginsService;
    }

    startStream(data) {
        this.$http.post("/api/startstream", {
            environment: data.environment,
            accessToken: data.accessToken,
            accountId: data.accountId,
            instruments: data.instruments
        }).then(() => {
            this.getStream();
        }).catch(err => {
            this.ToastsService.addToast(err);
        });
    }

    getStream() {
        const ws = new WebSocket("ws://localhost:8000/stream");

        ws.onmessage = event => {
            let data,
                isTick,
                tick,
                isTransaction,
                transaction,
                refreshPlugins;

            this.$timeout(() => {
                try {
                    data = angular$1.fromJson(event.data);

                    isTick = data.closeoutAsk && data.closeoutBid;
                    isTransaction = data.accountID;
                    refreshPlugins = data.refreshPlugins;

                    if (isTick) {
                        tick = {
                            time: data.time,
                            instrument: data.instrument,
                            ask: data.closeoutAsk,
                            bid: data.closeoutBid
                        };

                        this.QuotesService.updateTick(tick);
                        this.TradesService.updateTrades(tick);
                        this.OrdersService.updateOrders(tick);
                    }

                    if (isTransaction) {
                        transaction = data;
                        this.ActivityService.addActivity(transaction);

                        this.TradesService.refresh();
                        this.OrdersService.refresh();
                        this.AccountsService.refresh();
                    }

                    if (refreshPlugins) {
                        this.PluginsService.refresh();
                    }
                } catch (e) {

                    // Discard "incomplete" json
                    // console.log(e.name + ": " + e.message);
                }
            });
        };
    }
}
StreamingService.$inject = [
    "$timeout", "$http", "ToastsService",
    "QuotesService", "ActivityService", "TradesService",
    "OrdersService", "AccountsService", "PluginsService"
];

const streaming = angular$1
    .module("components.streaming", [])
    .service("StreamingService", StreamingService)
    .name;

class ToastsController {
    constructor(ToastsService) {
        this.ToastsService = ToastsService;
    }

    $onInit() {
        this.toasts = this.ToastsService.getToasts();
    }
}
ToastsController.$inject = ["ToastsService"];

const toastsComponent = {
    templateUrl: "app/components/toasts/toasts.html",
    controller: ToastsController
};

class ToastsService {
    constructor($timeout) {
        this.$timeout = $timeout;

        this.toasts = [];
        this.timeout = null;
    }

    getToasts() {
        return this.toasts;
    }

    addToast(message) {
        this.toasts.splice(0, 0, {
            date: new Date(),
            message
        });

        if (this.timeout) {
            this.$timeout.cancel(this.timeout);
        }
        this.timeout = this.reset();
    }

    reset() {
        return this.$timeout(() => {
            this.toasts.length = 0;
        }, 10000);
    }
}
ToastsService.$inject = ["$timeout"];

const toasts = angular$1
    .module("components.toasts", [])
    .component("toasts", toastsComponent)
    .service("ToastsService", ToastsService)
    .name;

class TokenDialogController {
    constructor($window, ToastsService, SessionService, AccountsService, StreamingService) {
        this.$window = $window;
        this.ToastsService = ToastsService;
        this.SessionService = SessionService;
        this.AccountsService = AccountsService;
        this.StreamingService = StreamingService;
    }

    $onInit() {
        const instrsStorage = this.$window.localStorage.getItem("argo.instruments");

        this.instrs = angular.fromJson(instrsStorage) || {
            EUR_USD: true,
            USD_JPY: true,
            GBP_USD: true,
            EUR_GBP: true,
            USD_CHF: true,
            EUR_JPY: true,
            EUR_CHF: true,
            USD_CAD: true,
            AUD_USD: true,
            GBP_JPY: true
        };

        this.environment = "practice";
        this.accounts = [];
    }

    login(tokenInfo) {
        if (tokenInfo) {
            this.environment = tokenInfo.environment;
            this.token = tokenInfo.token;
        } else {
            this.environment = "";
            this.token = "";
            this.accountId = "";
        }

        this.AccountsService.getAccounts({
            environment: this.environment,
            token: this.token
        }).then(accounts => {
            const message = "If your account id contains only digits " +
                "(ie. 2534233), it is a legacy account and you should use " +
                "release 3.x. For v20 accounts use release 4.x or higher. " +
                "Check your token.";

            if (!accounts.length) {
                throw new Error(message);
            }
            angular.extend(this.accounts, accounts);
        }).catch(err => {
            this.ToastsService.addToast(err);
            this.closeModal();
        });
    }

    selectAccount(accountSelected) {
        this.accountId = this.accounts[accountSelected].id;

        const tokenInfo = {
            environment: this.environment,
            token: this.token,
            accountId: this.accountId,
            instrs: this.instrs
        };

        this.SessionService.setCredentials(tokenInfo);

        this.AccountsService.getAccounts(tokenInfo).then(() => {
            const instruments = this.AccountsService
                .setStreamingInstruments(this.instrs);

            this.StreamingService.startStream({
                environment: this.environment,
                accessToken: this.token,
                accountId: this.accountId,
                instruments
            });

            this.closeModal({ tokenInfo });
        }).catch(err => {
            this.ToastsService.addToast(err);
            this.closeModal();
        });
    }

}
TokenDialogController.$inject = [
    "$window", "ToastsService", "SessionService",
    "AccountsService", "StreamingService"
];

const tokenDialogComponent = {
    templateUrl: "app/components/token-dialog/token-dialog.html",
    controller: TokenDialogController,
    bindings: {
        openModal: "=",
        closeModal: "&"
    }
};

const tokenDialog = angular$1
    .module("components.token-dialog", [])
    .component("tokenDialog", tokenDialogComponent)
    .name;

class TradesController {
    constructor(ToastsService, TradesService) {
        this.ToastsService = ToastsService;
        this.TradesService = TradesService;
    }

    $onInit() {
        this.trades = this.TradesService.getTrades();

        this.TradesService.refresh();
    }

    closeTrade(tradeId) {
        this.openCloseTradeModal = true;
        this.closingTradeId = tradeId;
    }

    closeTradeDialog(answer) {
        this.openCloseTradeModal = false;

        if (!answer) {
            return;
        }

        this.TradesService.closeTrade(this.closingTradeId).then(trade => {
            let message = "Closed " +
                    `${(trade.units > 0 ? "sell" : "buy")} ` +
                    `${trade.instrument} ` +
                    `#${trade.id} ` +
                    `@${trade.price} ` +
                    `P&L ${trade.pl}`;

            if (trade.errorMessage || trade.message) {
                message = `ERROR ${trade.errorMessage || trade.message}`;
            }


            this.ToastsService.addToast(message);
        }).catch(err => {
            const message = `ERROR ${err.code} ${err.message}`;

            this.ToastsService.addToast(message);
        });
    }

}
TradesController.$inject = ["ToastsService", "TradesService"];

const tradesComponent = {
    templateUrl: "app/components/trades/trades.html",
    controller: TradesController
};

class TradesService {
    constructor($http, SessionService, AccountsService) {
        this.$http = $http;
        this.SessionService = SessionService;
        this.AccountsService = AccountsService;

        this.trades = [];
    }

    getTrades() {
        return this.trades;
    }

    refresh() {
        this.SessionService.isLogged().then(credentials => {
            this.$http.post("/api/trades", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            }).then(res => {
                this.trades.length = 0;
                angular$1.extend(this.trades, res.data);
                this.trades.forEach(trade => {
                    trade.side = trade.currentUnits > 0 ? "buy" : "sell";
                });
            });
        });
    }

    closeTrade(id) {
        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/closetrade", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                id
            }).then(order => order.data)
            .catch(err => err.data)
        );
    }

    updateTrades(tick) {
        const account = this.AccountsService.getAccount(),
            pips = account.pips;

        this.trades.forEach((trade, index) => {
            let current,
                side;

            if (trade.instrument === tick.instrument) {
                side = trade.currentUnits > 0 ? "buy" : "sell";

                if (side === "buy") {
                    current = tick.bid;
                    this.trades[index].profitPips =
                        ((current - trade.price) / pips[trade.instrument]);
                }
                if (side === "sell") {
                    current = tick.ask;
                    this.trades[index].profitPips =
                        ((trade.price - current) / pips[trade.instrument]);
                }

                this.trades[index].current = current;
            }
        });
    }
}
TradesService.$inject = ["$http", "SessionService", "AccountsService"];

const trades = angular$1
    .module("components.trades", [])
    .component("trades", tradesComponent)
    .service("TradesService", TradesService)
    .name;

class YesNoDialogController {
}
YesNoDialogController.$inject = [];

const yesnoDialogComponent = {
    templateUrl: "app/components/yesno-dialog/yesno-dialog.html",
    controller: YesNoDialogController,
    bindings: {
        openModal: "=",
        closeModal: "&",
        text: "@"
    }
};

const yesnoDialog = angular$1
    .module("components.yesno-dialog", [])
    .component("yesnoDialog", yesnoDialogComponent)
    .name;

const components = angular$1
    .module("components", [
        account,
        activity,
        charts,
        dualColor,
        exposure,
        header,
        highlighter,
        news,
        ohlcChart,
        orderDialog,
        orders,
        plugins,
        positions,
        quotes,
        session,
        settingsDialog,
        slChart,
        streaming,
        toasts,
        tokenDialog,
        trades,
        yesnoDialog
    ])
    .name;

const root = angular$1
    .module("root", [
        common,
        components
    ])
    .component("root", rootComponent)
    .name;

exports.root = root;

}((this.app = this.app || {}),angular,d3,techan));
