(function (mocha,chai) {
    'use strict';

    class Util {
        static query(selector) {
            return document.querySelector(selector) ||
                console.error(selector, "not found");
        }

        static handleEvent(context, e, payload) {
            const type = e.type;
            const id = e.target.id || console.warn(e.target, "target without id");
            const method = `on${id[0].toUpperCase()}${id.split("-")[0].slice(1)}` +
                `${type[0].toUpperCase()}${type.slice(1)}`;


            return method in context ? context[method](e, payload)
                : console.warn(method, "not implemented");
        }

        static renderEmpty(render) {
            return render``;
        }

        static getHHMMSSfromDate(date) {
            if (!date) {
                return "";
            }

            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const seconds = date.getSeconds().toString().padStart(2, "0");

            return `${hours}:${minutes}:${seconds}`;
        }

        static formatDate(date) {
            if (!date || !date.toString()) {
                return "";
            }

            return (new Date(date)).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        }

        static formatNumber(num, decimals = 0) {
            if (!num || !num.toString()) {
                return "";
            }

            return parseFloat(num).toFixed(decimals);
        }

        static fetch(url, options) {
            options.headers = options.headers ||
                { "Content-Type": "application/json" };

            options.body = typeof options.body === "string" ? options.body
                : JSON.stringify(options.body);

            const fetchCall = fetch(url, options);

            Util.spinnerState.isLoadingView = true;
            fetchCall.then(() => {
                Util.spinnerState.isLoadingView = false;
            }).catch(() => {
                Util.spinnerState.isLoadingView = false;
            });

            return fetchCall;
        }

        static show(condition) {
            return condition ? "display: block;" : "display: none;";
        }

        static hide(condition) {
            return Util.show(!condition);
        }
    }

    Util.spinnerState = {};

    class SessionService {
        static setCredentials(session) {
            SessionService.credentials.environment = session.environment;
            SessionService.credentials.token = session.token;
            SessionService.credentials.accountId = session.accountId;
        }

        static isLogged() {
            if (SessionService.credentials.token) {
                return SessionService.credentials;
            }

            return null;
        }
    }

    SessionService.credentials = {
        environment: null,
        token: null,
        accountId: null
    };

    class AccountsService {
        constructor(account) {
            if (!AccountsService.account) {
                AccountsService.account = account;
            }
        }

        static getAccount() {
            return AccountsService.account;
        }

        static refresh() {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return;
            }

            AccountsService.getAccounts({
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            });
        }

        static getAccounts({
            environment = "practice",
            token = "abc",
            accountId = null
        } = {}) {
            const api = accountId ? "/api/account" : "/api/accounts";

            return Util.fetch(api, {
                method: "post",
                body: JSON.stringify({
                    environment,
                    token,
                    accountId
                })
            }).then(res => res.json()).then(data => {
                const accounts = data.accounts || data;

                if (data.message) {
                    throw data.message;
                }

                if (!accounts.length) {
                    Object.assign(AccountsService.account, data.account);

                    AccountsService.account.timestamp = new Date();

                    AccountsService.account.unrealizedPLPercent =
                        AccountsService.account.unrealizedPL /
                            AccountsService.account.balance * 100;

                    if (!Object.keys(AccountsService.account.instruments).length) {
                        Util.fetch("/api/instruments", {
                            method: "post",
                            body: JSON.stringify({
                                environment,
                                token,
                                accountId
                            })
                        }).then(res => res.json()).then(instruments => {
                            AccountsService.account.instruments = instruments;
                            AccountsService.account.pips = {};
                            AccountsService.account.instruments.forEach(i => {
                                AccountsService.account.pips[i.name] =
                                    Math.pow(10, i.pipLocation);
                            });

                            return AccountsService.account;
                        });
                    }
                }

                return accounts;
            });
        }

        static setStreamingInstruments(settings) {
            AccountsService.account.streamingInstruments = Object.keys(settings)
                .filter(el => !!settings[el]);

            return AccountsService.account.streamingInstruments;
        }
    }

    AccountsService.account = null;

    const { beforeEach, describe, it } = window;

    describe("AccountsService", () => {
        const environment = "my environment";
        const token = "my token";
        const accountId = "my account id";

        beforeEach(() => {
            const apiAccount = "/api/account";
            const apiInstruments = "/api/instruments";

            AccountsService.account = {};

            SessionService.setCredentials({
                environment,
                token,
                accountId
            });

            fetch.mock(apiAccount, {
                account: {
                    currency: "USD",
                    accountId: 7442890,
                    balance: 110410.5028,
                    marginAvailable: 110394.9676,
                    marginCallMarginUsed: 18.1671,
                    realizedPL: -1983.78,
                    unrealizedPL: 2.6319,
                    instruments: ["EUR_USD"]
                }
            });

            fetch.mock(apiInstruments, [
                {
                    displayName: "EUR/USD",
                    name: "EUR_USD",
                    maximumOrderUnits: "100000000",
                    pipLocation: -4
                }
            ]);
        });

        it("getAccount", () => {
            const account = AccountsService.getAccount();

            chai.assert.strictEqual(0, Object.keys(account).length);
        });

        it("getAccounts", done => {
            AccountsService.getAccounts({
                environment,
                token,
                accountId
            }).then(() => {
                const account = AccountsService.account;

                chai.assert.strictEqual("USD", account.currency);
                chai.assert.strictEqual(7442890, account.accountId);
                chai.assert.strictEqual(110410.5028, account.balance);
                chai.assert.strictEqual(110394.9676, account.marginAvailable);
                chai.assert.strictEqual(18.1671, account.marginCallMarginUsed);
                chai.assert.strictEqual(-1983.78, account.realizedPL);
                chai.assert.strictEqual(2.6319, account.unrealizedPL);
                chai.assert.strictEqual(true, account.timestamp !== null);
                chai.assert.strictEqual(0.0023837406163863604, account.unrealizedPLPercent);
            }).then(done).catch(done);
        });
    });

    class ActivityService {
        constructor(activities) {
            if (!ActivityService.activities) {
                ActivityService.activities = activities;
            }
        }

        static refresh() {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return null;
            }

            const account = AccountsService.getAccount(),
                lastTransactionID = account.lastTransactionID;

            return Util.fetch("/api/transactions", {
                method: "post",
                body: JSON.stringify({
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    lastTransactionID
                })
            }).then(res => res.json()).then(data => {
                ActivityService.activities.length = 0;
                data.reverse().forEach(activity => {
                    ActivityService.activities.push(activity);
                });

                return ActivityService.activities;
            }).catch(err => err.data);
        }

        static addActivity(activity) {
            ActivityService.activities.splice(0, 0, {
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

    ActivityService.activities = null;

    const { beforeEach: beforeEach$1, describe: describe$1, it: it$1 } = window;

    describe$1("ActivityService", () => {
        const environment = "my environment";
        const token = "my token";
        const accountId = "my account id";
        const activity = {
            id: 176403879,
            accountId: 6765103,
            time: "2014-04-07T18:31:05Z",
            type: "MARKET_ORDER_CREATE",
            instrument: "EUR_USD",
            units: 2,
            side: "buy",
            price: 1.25325,
            pl: 0,
            interest: 0,
            accountBalance: 100000,
            tradeOpened: {
                id: 176403879,
                units: 2
            }
        };

        beforeEach$1(() => {
            const apiTransactions = "/api/transactions";

            /* eslint no-new:off */
            new ActivityService([]);

            SessionService.setCredentials({
                environment,
                token,
                accountId
            });

            AccountsService.account = {
                lastTransactionID: 123,
                streamingInstruments: ["EUR_USD"],
                pips: {
                    EUR_USD: 0.0001
                }
            };

            fetch.mock(apiTransactions, [activity]);
        });

        it$1("getActivities", done => {
            ActivityService.refresh().then(activities => {
                chai.assert.lengthOf(activities, 1);

                chai.assert.strictEqual(176403879, activities[0].id);
                chai.assert.strictEqual("MARKET_ORDER_CREATE", activities[0].type);
                chai.assert.strictEqual("EUR_USD", activities[0].instrument);
                chai.assert.strictEqual(2, activities[0].units);
                chai.assert.strictEqual(1.25325, activities[0].price);
                chai.assert.strictEqual(0, activities[0].interest);
                chai.assert.strictEqual(0, activities[0].pl);
                chai.assert.strictEqual(100000, activities[0].accountBalance);
                chai.assert.strictEqual("2014-04-07T18:31:05Z", activities[0].time);
            }).then(done).catch(done);
        });

        it$1("addActivity", () => {
            chai.expect(() => {
                ActivityService.addActivity(activity);
            }).to.not.throw(TypeError);
        });
    });

    class TradesService {
        constructor(trades) {
            if (!TradesService.trades) {
                TradesService.trades = trades;
            }
        }

        static getTrades() {
            return TradesService.trades;
        }

        static refresh() {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return null;
            }

            return Util.fetch("/api/trades", {
                method: "post",
                body: JSON.stringify({
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                })
            }).then(res => res.json()).then(data => {
                TradesService.trades.value.splice(0, TradesService.trades.value.length);

                data.forEach(trade => {
                    trade.side = trade.currentUnits > 0 ? "buy" : "sell";
                    TradesService.trades.value.push(trade);
                });

                ExposureService.refresh();

                return TradesService.trades.value;
            });
        }

        static closeTrade(id) {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return null;
            }

            return Util.fetch("/api/closetrade", {
                method: "post",
                body: JSON.stringify({
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    id
                })
            }).then(res => res.json()).then(data => data)
                .catch(err => err.data);
        }

        static updateTrades(tick) {
            const account = AccountsService.getAccount(),
                pips = account.pips;

            TradesService.trades.value.forEach((trade, index) => {
                let current,
                    side;

                if (trade.instrument === tick.instrument) {
                    side = trade.currentUnits > 0 ? "buy" : "sell";

                    if (side === "buy") {
                        current = tick.bid;
                        TradesService.trades.value[index].profitPips =
                            ((current - trade.price) / pips[trade.instrument]);
                    }
                    if (side === "sell") {
                        current = tick.ask;
                        TradesService.trades.value[index].profitPips =
                            ((trade.price - current) / pips[trade.instrument]);
                    }

                    TradesService.trades.value[index].current = current;
                }
            });
        }
    }

    TradesService.trades = null;

    class ExposureService {
        constructor(exposure) {
            if (!ExposureService.exposure) {
                ExposureService.exposure = exposure;
            }
        }

        static getExposure() {
            return ExposureService.exposure;
        }

        static refresh() {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return;
            }

            const trades = TradesService.getTrades(),
                exps = {};

            trades.value.forEach(trade => {
                const legs = trade.instrument.split("_");

                exps[legs[0]] = exps[legs[0]] || 0;
                exps[legs[1]] = exps[legs[1]] || 0;

                exps[legs[0]] += parseInt(trade.currentUnits, 10);
                exps[legs[1]] -= trade.currentUnits * trade.price;
            });

            ExposureService.exposure.splice(0, ExposureService.exposure.length);
            Object.keys(exps).forEach(exp => {
                const type = exps[exp] > 0;

                ExposureService.exposure.push({
                    type: type ? "Long" : "Short",
                    market: exp,
                    units: Math.abs(exps[exp])
                });
            });

        }
    }

    ExposureService.exposure = null;

    const { beforeEach: beforeEach$2, describe: describe$2, it: it$2 } = window;

    describe$2("Exposure", () => {

        beforeEach$2(() => {
            TradesService.trades = {
                value: [
                    {
                        instrument: "EUR_USD",
                        currentUnits: 100,
                        price: 1.2345
                    },
                    {
                        instrument: "GPB_USD",
                        currentUnits: 200,
                        price: 1.4678
                    }
                ]
            };

            ExposureService.exposure = [];
            ExposureService.refresh();
        });

        it$2("test", () => {
            const exposures = ExposureService.exposure;

            chai.assert.lengthOf(exposures, 3);

            chai.assert.strictEqual("EUR", exposures[0].market);
            chai.assert.strictEqual(100, exposures[0].units);
            chai.assert.strictEqual("Long", exposures[0].type);

            chai.assert.strictEqual("USD", exposures[1].market);
            chai.assert.strictEqual(417.01, exposures[1].units);
            chai.assert.strictEqual("Short", exposures[1].type);

            chai.assert.strictEqual("GPB", exposures[2].market);
            chai.assert.strictEqual(200, exposures[2].units);
            chai.assert.strictEqual("Long", exposures[2].type);
        });
    });

    class OrdersService {
        constructor(orders) {
            if (!OrdersService.orders) {
                OrdersService.orders = orders;
            }
        }


        static getOrders() {
            return OrdersService.orders;
        }

        static refresh() {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return null;
            }

            return Util.fetch("/api/orders", {
                method: "post",
                body: JSON.stringify({
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                })
            }).then(res => res.json()).then(data => {
                OrdersService.orders.splice(0, OrdersService.orders.length);

                data.forEach(trade => {
                    OrdersService.orders.push(trade);
                });

                return OrdersService.orders;
            });
        }

        static putOrder(order) {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return null;
            }

            return Util.fetch("/api/order", {
                method: "post",
                body: JSON.stringify({
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
                })
            }).then(res => res.json()).then(data => data)
                .catch(err => err.data);
        }

        static closeOrder(id) {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return null;
            }

            return Util.fetch("/api/closeorder", {
                method: "post",
                body: JSON.stringify({
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    id
                })
            }).then(res => res.json()).then(data => data)
                .catch(err => err.data);
        }

        static updateOrders(tick) {
            const account = AccountsService.getAccount(),
                pips = account.pips;

            OrdersService.orders.forEach((order, index) => {
                let current;

                if (order.instrument === tick.instrument) {

                    if (order.units > 0) {
                        current = tick.ask;
                    }
                    if (order.units < 0) {
                        current = tick.bid;
                    }

                    OrdersService.orders[index].current = current;
                    OrdersService.orders[index].distance = (Math.abs(current - order.price) /
                        pips[order.instrument]);
                }
            });
        }
    }

    OrdersService.orders = null;

    const { beforeEach: beforeEach$3, describe: describe$3, it: it$3 } = window;

    describe$3("ordersService", () => {
        const environment = "my environment";
        const token = "my token";
        const accountId = "my account id";
        const mockedOrders = [
            {
                id: 175427639,
                instrument: "EUR_USD",
                units: 20,
                side: "buy",
                type: "marketIfTouched",
                time: "2014-02-11T16:22:07Z",
                price: 1,
                takeProfit: 0,
                stopLoss: 0,
                expiry: "2014-02-15T16:22:07Z",
                upperBound: 0,
                lowerBound: 0,
                trailingStop: 0
            },
            {
                id: 175427637,
                instrument: "EUR_USD",
                units: 10,
                side: "sell",
                type: "marketIfTouched",
                time: "2014-02-11T16:22:07Z",
                price: 1,
                takeProfit: 0,
                stopLoss: 0,
                expiry: "2014-02-12T16:22:07Z",
                upperBound: 0,
                lowerBound: 0,
                trailingStop: 0
            }
        ];

        beforeEach$3(() => {
            const apiOrders = "/api/orders";

            /* eslint no-new:off */
            new OrdersService([]);

            SessionService.setCredentials({
                environment,
                token,
                accountId
            });

            fetch.mock(apiOrders, mockedOrders);
        });

        it$3("getOrders", done => {
            OrdersService.refresh().then(orders => {
                chai.assert.lengthOf(orders, 2);

                chai.assert.strictEqual(175427637, orders[1].id);
                chai.assert.strictEqual("EUR_USD", orders[1].instrument);
                chai.assert.strictEqual(10, orders[1].units);
                chai.assert.strictEqual("sell", orders[1].side);
                chai.assert.strictEqual("marketIfTouched", orders[1].type);
                chai.assert.strictEqual("2014-02-11T16:22:07Z", orders[1].time);
                chai.assert.strictEqual(1, orders[1].price);
                chai.assert.strictEqual(0, orders[1].takeProfit);
                chai.assert.strictEqual(0, orders[1].stopLoss);
                chai.assert.strictEqual("2014-02-12T16:22:07Z", orders[1].expiry);
                chai.assert.strictEqual(0, orders[1].takeProfit);
                chai.assert.strictEqual(0, orders[1].upperBound);
                chai.assert.strictEqual(0, orders[1].lowerBound);
                chai.assert.strictEqual(0, orders[1].trailingStop);
            }).then(done).catch(done);
        });
    });

    class PluginsService {
        constructor(pluginsState) {
            if (!PluginsService.plugins) {
                PluginsService.plugins = pluginsState.plugins;
                PluginsService.pluginsInfo = pluginsState.pluginsInfo;
            }
        }

        static getPlugins() {
            return PluginsService.plugins;
        }

        static getPluginsInfo() {
            return PluginsService.pluginsInfo;
        }

        static refresh() {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return null;
            }

            return Util.fetch("/api/plugins", {
                method: "post",
                body: JSON.stringify({
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                })
            }).then(res => res.json()).then(data => {
                for (const name in PluginsService.plugins) {
                    if (PluginsService.plugins[name].toString()) {
                        delete PluginsService.plugins[name];
                    }
                }

                Object.assign(PluginsService.plugins, data);

                PluginsService.pluginsInfo.count = Object.keys(
                    PluginsService.plugins
                ).length;

                Object.keys(PluginsService.plugins).forEach(key => {
                    if (PluginsService.plugins[key] === "enabled") {
                        PluginsService.plugins[key] = true;
                    } else {
                        PluginsService.plugins[key] = false;
                    }
                });
            });
        }

        static engagePlugins(plugs) {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return;
            }

            const account = AccountsService.getAccount();

            Util.fetch("/api/engageplugins", {
                method: "post",
                body: JSON.stringify({
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    plugins: plugs,
                    config: {
                        pips: account.pips
                    }
                })
            });
        }
    }

    PluginsService.plugins = null;
    PluginsService.pluginsInfo = null;

    const { beforeEach: beforeEach$4, describe: describe$4, it: it$4 } = window;

    describe$4("pluginsService", () => {
        const environment = "my environment";
        const token = "my token";
        const accountId = "my account id";
        const mockedPlugins = {
            testPlugin: true
        };

        beforeEach$4(() => {
            const apiPlugins = "/api/plugins";

            /* eslint no-new:off */
            new PluginsService({
                plugins: {},
                pluginsInfo: {}
            });

            SessionService.setCredentials({
                environment,
                token,
                accountId
            });

            fetch.mock(apiPlugins, mockedPlugins);
        });

        it$4("refresh plugins", done => {
            PluginsService.refresh().then(() => {
                const pluginsInfo = PluginsService.pluginsInfo;

                chai.assert.strictEqual(1, pluginsInfo.count);
            }).then(done).catch(done);
        });
    });

    class PositionsService {
        constructor(positions) {
            if (!PositionsService.positions) {
                PositionsService.positions = positions;
            }
        }

        static refresh() {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return null;
            }

            return Util.fetch("/api/positions", {
                method: "post",
                body: JSON.stringify({
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                })
            }).then(res => res.json()).then(positions => {
                PositionsService.positions.splice(0, PositionsService.positions.length);

                positions.forEach(position => {
                    const longUnits = position.long &&
                        parseInt(position.long.units, 10);
                    const shortUnits = position.short &&
                        parseInt(position.short.units, 10);
                    const units = longUnits || shortUnits;
                    const side = units > 0 ? "buy" : "sell";
                    const avgPrice = (longUnits && position.long.averagePrice) ||
                        (shortUnits && position.short.averagePrice);

                    PositionsService.positions.push({
                        side,
                        instrument: position.instrument,
                        units,
                        avgPrice
                    });
                });

                return PositionsService.positions;
            }).catch(err => err.data);
        }
    }

    PositionsService.positions = null;

    const { beforeEach: beforeEach$5, describe: describe$5, it: it$5 } = window;

    describe$5("positionsService", () => {
        const environment = "my environment";
        const token = "my token";
        const accountId = "my account id";
        const mockedPositions = [
            {
                instrument: "EUR_USD",
                long: {
                    units: 4741,
                    averagePrice: 1.3626
                }
            },
            {
                instrument: "USD_CAD",
                short: {
                    units: -30,
                    averagePrice: 1.11563
                }
            },
            {
                instrument: "USD_JPY",
                long: {
                    units: 88,
                    averagePrice: 102.455
                }
            }
        ];

        beforeEach$5(() => {
            const apiPositions = "/api/positions";

            /* eslint no-new:off */
            new PositionsService([]);

            SessionService.setCredentials({
                environment,
                token,
                accountId
            });

            fetch.mock(apiPositions, mockedPositions);
        });

        it$5("getPositions", done => {
            PositionsService.refresh().then(positions => {
                chai.assert.lengthOf(positions, 3);

                chai.assert.strictEqual("USD_CAD", positions[1].instrument);
                chai.assert.strictEqual(-30, positions[1].units);
                chai.assert.strictEqual("sell", positions[1].side);
                chai.assert.strictEqual(1.11563, positions[1].avgPrice);
            }).then(done).catch(done);
        });

    });

    class QuotesService {
        constructor(quotes) {
            if (!QuotesService.quotes) {
                QuotesService.quotes = quotes;
            }
        }

        static getQuotes() {
            return QuotesService.quotes;
        }

        static updateTick(tick) {
            const account = AccountsService.getAccount(),
                streamingInstruments = account.streamingInstruments,
                pips = account.pips,
                instrument = tick.instrument,
                lenStreamingInstruments = Object.keys(streamingInstruments).length,
                lenQuotesInstruments = Object.keys(QuotesService.quotes).length;

            if (lenStreamingInstruments !== lenQuotesInstruments) {
                streamingInstruments.forEach(instr => {
                    QuotesService.quotes[instr].instrument = instr;
                });
            }

            QuotesService.quotes[instrument].time = tick.time;
            QuotesService.quotes[instrument].ask = tick.ask;
            QuotesService.quotes[instrument].bid = tick.bid;
            QuotesService.quotes[instrument].spread =
                ((tick.ask - tick.bid) / pips[instrument]).toFixed(1);
        }

        static reset() {
            for (const instr in QuotesService.quotes) {
                if (QuotesService.quotes[instr].instrument === instr) {
                    delete QuotesService.quotes[instr];
                }
            }
        }
    }

    QuotesService.quotes = null;

    const { beforeEach: beforeEach$6, describe: describe$6, it: it$6 } = window;

    describe$6("quotesService", () => {

        beforeEach$6(() => {
            AccountsService.account = {
                streamingInstruments: ["EUR_USD"],
                pips: {
                    EUR_USD: 0.0001
                }
            };

            QuotesService.quotes = {
                EUR_USD: {}
            };
            QuotesService.updateTick({
                instrument: "EUR_USD",
                time: "2013-06-21T17:41:04.648747Z",
                ask: 1.31528,
                bid: 1.31513
            });
        });

        it$6("getQuotes", () => {
            const quotes = QuotesService.getQuotes(),
                eurusd = quotes.EUR_USD;

            chai.assert.strictEqual("2013-06-21T17:41:04.648747Z", eurusd.time);
            chai.assert.strictEqual(1.31528, eurusd.ask);
            chai.assert.strictEqual(1.31513, eurusd.bid);
            chai.assert.strictEqual("1.5", eurusd.spread);
        });

    });

    const { beforeEach: beforeEach$7, describe: describe$7, it: it$7 } = window;

    describe$7("tradesService", () => {
        const environment = "my environment";
        const token = "my token";
        const accountId = "my account id";
        const mockedTrades = [
            {
                id: 175427743,
                units: 2,
                side: "sell",
                instrument: "EUR_USD",
                time: "2014-02-13T17:47:57Z",
                price: 1.36687,
                takeProfit: 0,
                stopLoss: 0,
                trailingStop: 0,
                trailingAmount: 0
            },
            {
                id: 175427742,
                units: 2,
                side: "sell",
                instrument: "EUR_USD",
                time: "2014-02-13T17:47:56Z",
                price: 1.36687,
                takeProfit: 0,
                stopLoss: 0,
                trailingStop: 0,
                trailingAmount: 0
            }
        ];


        beforeEach$7(() => {
            const apiTrades = "/api/trades";

            /* eslint no-new:off */
            new TradesService({ value: [] });

            SessionService.setCredentials({
                environment,
                token,
                accountId
            });

            fetch.mock(apiTrades, mockedTrades);
        });

        it$7("getTrades", done => {
            TradesService.refresh().then(trades => {
                chai.assert.lengthOf(trades, 2);

                chai.assert.strictEqual(175427743, trades[0].id);
                chai.assert.strictEqual(2, trades[0].units);
                chai.assert.strictEqual("sell", trades[0].side);
                chai.assert.strictEqual("EUR_USD", trades[0].instrument);
                chai.assert.strictEqual("2014-02-13T17:47:57Z", trades[0].time);
                chai.assert.strictEqual(1.36687, trades[0].price);
                chai.assert.strictEqual(0, trades[0].takeProfit);
                chai.assert.strictEqual(0, trades[0].stopLoss);
                chai.assert.strictEqual(0, trades[0].trailingStop);
                chai.assert.strictEqual(0, trades[0].trailingAmount);
            }).then(done).catch(done);
        });
    });

    (function(self) {
        const responses = {};

        function mockResponse(
            body = {},
            headers = { "Content-type": "application/json" }
        ) {
            return Promise.resolve(new Response(JSON.stringify(body), {
                status: 200,
                headers: new Headers(headers)
            }));
        }

        self.fetch = url => {
            if (url in responses) {
                return mockResponse(responses[url.toString()]);
            }

            return mockResponse();
        };

        self.fetch.mock = (api, data) => {
            responses[api] = data;
        };
    }(typeof self !== "undefined" ? self : window));

}(mocha,chai));
