(function (hyperHTML,Introspected,d3,techan) {
    'use strict';

    hyperHTML = hyperHTML && hyperHTML.hasOwnProperty('default') ? hyperHTML['default'] : hyperHTML;
    Introspected = Introspected && Introspected.hasOwnProperty('default') ? Introspected['default'] : Introspected;
    techan = techan && techan.hasOwnProperty('default') ? techan['default'] : techan;

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

    class RootTemplate {
        static update(render) {
            render`<app class="arimo"></app>`;
        }
    }

    class RootComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("root"));

            RootTemplate.update(render);
        }
    }

    RootComponent.bootstrap();

    class AppTemplate {
        static update(render, state) {
            const tabClasses = "f6 f5-l pointer bg-animate black-80 hover-bg-light-blue dib pa3 ph4-l";
            const selectedTabClasses = `${tabClasses} bg-blue`;
            const isTradesTab = state.tabSelectedIndex === 0;
            const isOrdersTab = state.tabSelectedIndex === 1;
            const isPositionsTab = state.tabSelectedIndex === 2;
            const isExposureTab = state.tabSelectedIndex === 3;
            const isActivityTab = state.tabSelectedIndex === 4;
            const isNewsTab = state.tabSelectedIndex === 5;
            const isPluginsTab = state.tabSelectedIndex === 6;

            /* eslint-disable indent */
            render`
            <header></header>

            <nav class="bt bb tc mw9 center shadow-2 tracked">
                <a class="${isTradesTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 0;
                    }}">Trades</a>
                <a class="${isOrdersTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 1;
                    }}">Orders</a>
                <a class="${isPositionsTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 2;
                    }}">Positions</a>
                <a class="${isExposureTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 3;
                    }}">Exposures</a>
                <a class="${isActivityTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 4;
                    }}">Activity</a>
                <a class="${isNewsTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 5;
                    }}">News</a>
                <a class="${isPluginsTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 6;
                    }}">Plugins</a>
            </nav>

            <div class="flex flex-wrap-s flex-wrap-m ma2 pa2">
                <div class="flex flex-wrap flex-column min-w-25">
                    <account class="mb4"></account>
                    <quotes class="mb4"></quotes>
                    <toasts></toasts>
                </div>
                <div class="flex flex-wrap flex-column min-w-75">
                    <div class="ma2 pa2">
                        <trades style="${Util.show(isTradesTab)}"></trades>
                        <orders style="${Util.show(isOrdersTab)}"></orders>
                        <positions style="${Util.show(isPositionsTab)}"></positions>
                        <exposure style="${Util.show(isExposureTab)}"></exposure>
                        <activity style="${Util.show(isActivityTab)}"></activity>
                        <news style="${Util.show(isNewsTab)}"></news>
                        <plugins style="${Util.show(isPluginsTab)}"></plugins>
                    </div>
                    <charts></charts>
                </div>
            </div>
        `;
            /* eslint-enable indent */
        }
    }

    class AppController {
        constructor(render, template) {
            this.state = Introspected({
                tabSelectedIndex: 0
            }, state => template.update(render, state));
        }
    }

    class AppComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("app"));

            this.appController = new AppController(render, AppTemplate);
        }
    }

    AppComponent.bootstrap();

    class AccountTemplate {
        static update(render, state) {
            if (state.account.id.toString()) {
                AccountTemplate.renderAccount(render, state);
            } else {
                AccountTemplate.renderNoAccount(render);
            }
        }

        static renderAccount(render, state) {
            const timestamp = Util.formatDate(new Date(state.account.timestamp));
            const balance = parseFloat(state.account.balance).toFixed(2);
            const unrealizedPL = parseFloat(state.account.unrealizedPL).toFixed(2);
            const unrealizedPLPercent = parseFloat(state.account.unrealizedPLPercent).toFixed(2);
            const NAV = parseFloat(state.account.NAV).toFixed(2);
            const pl = parseFloat(state.account.pl).toFixed(2);
            const marginCallMarginUsed = parseFloat(state.account.marginCallMarginUsed).toFixed(2);
            const marginAvailable = parseFloat(state.account.marginAvailable).toFixed(2);
            const marginCloseoutPositionValue = parseFloat(state.account.marginCloseoutPositionValue).toFixed(2);
            const marginCloseoutPercent = parseFloat(state.account.marginCloseoutPercent).toFixed(2);
            const positionValue = parseFloat(state.account.positionValue).toFixed(2);

            /* eslint-disable indent */
            render`
            <div class="h6 overflow-auto">
                <table class="collapse f6 w-100 mw8 center">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1">Account Summary</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1">
                            ${timestamp} (${state.account.currency})
                        </th>
                    </thead>

                    <tbody>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Balance</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${balance}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Unrealized P&amp;L</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${unrealizedPL}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Unrealized P&amp;L (%)</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${unrealizedPLPercent}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Net Asset Value</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${NAV}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Realized P&amp;L</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${pl}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Margin Used</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${marginCallMarginUsed}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Margin Available</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${marginAvailable}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Margin Closeout Value</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${marginCloseoutPositionValue}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Margin Closeout Value (%)</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${marginCloseoutPercent}</td>
                        </tr>
                        <tr>
                            <td class="fw6 bb b--black-20 tl pb1 pr1">Position Value</td>
                            <td class="pv1 pr1 bb b--black-20 tr">${positionValue}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
            /* eslint-enable indent */
        }

        static renderNoAccount(render) {
            /* eslint-disable indent */
            render`
            <div class="h6 overflow-auto">
                <p class="f6 w-100 mw8 center b">No account.</p>
            </div>
        `;
            /* eslint-enable indent */
        }
    }

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

    class AccountController {
        constructor(render, template) {

            this.state = Introspected({
                account: {}
            }, state => template.update(render, state));

            this.accountsService = new AccountsService(this.state.account);
        }
    }

    class AccountComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("account"));

            this.accountController = new AccountController(render, AccountTemplate);
        }
    }

    AccountComponent.bootstrap();

    class ActivityTemplate {
        static update(render, state) {
            if (state.activities.length) {
                ActivityTemplate.renderActivity(render, state);
            } else {
                ActivityTemplate.renderNoActivity(render);
            }
        }

        static renderActivity(render, state) {
            /* eslint-disable indent */
            render`
            <div class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Ticket</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Type</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Units</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Price</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Profit</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Balance</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Date/Time</th>
                    </thead>

                    <tbody>${
                        state.activities.map(activity => {
                            const classes = "pv1 pr1 bb b--black-20 tr";
                            const highlight = classes +
                                (activity.pl >= 0 ? " highlight-green" : " highlight-red");

                            return hyperHTML.wire(activity, ":tr")`<tr>
                                <td class="${classes}"> ${activity.id} </td>
                                <td class="${classes}"> ${activity.type} </td>
                                <td class="${classes}"> ${activity.instrument} </td>
                                <td class="${classes}"> ${Util.formatNumber(activity.units)} </td>
                                <td class="${classes}"> ${activity.price} </td>
                                <td class="${highlight}"> ${Util.formatNumber(activity.pl, 4)} </td>
                                <td class="${classes}"> ${Util.formatNumber(activity.accountBalance, 2)} </td>
                                <td class="${classes}"> ${Util.formatDate(activity.time)} </td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>
        `;
            /* eslint-enable indent */
        }

        static renderNoActivity(render) {
            /* eslint-disable indent */
            render`
            <div class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No activities.</p>
            </div>
        `;
            /* eslint-enable indent */
        }
    }

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

    class ActivityController {
        constructor(render, template) {

            this.state = Introspected({
                activities: []
            }, state => template.update(render, state));

            this.activityService = new ActivityService(this.state.activities);
        }
    }

    class ActivityComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("activity"));

            this.activityController = new ActivityController(render, ActivityTemplate);
        }
    }

    ActivityComponent.bootstrap();

    class ChartsTemplate {
        static update(render, state, events) {
            if (!Object.keys(state.account.streamingInstruments).length) {
                Util.renderEmpty(render);
                return;
            }

            /* eslint-disable indent */
            render`
            <div class="flex flex-wrap flex-row justify-center justify-around mb2">
                <select id="chartInstrument" onchange="${e => {
                        const instrument = e.target.value.trim();

                        if (state.selectedInstrument !== instrument) {
                            events(e, {
                                instrument,
                                granularity: state.selectedGranularity
                            });
                        }
                    }}">${

                    state.account.streamingInstruments.map(instrument => hyperHTML.wire()`
                    <option value="${instrument}">
                        ${instrument}
                    </option>
                `)}</select>

                <select id="chartGranularity" onchange="${e => {
                        const granularity = e.target.value.trim();

                        if (state.selectedGranularity !== granularity) {
                            events(e, {
                                instrument: state.selectedInstrument,
                                granularity
                            });
                        }
                    }}">${

                    state.granularities.map(granularity => hyperHTML.wire()`
                    <option value="${granularity}">
                        ${granularity}
                    </option>
                `)}</select>

                <a class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4">
                    <span id="openOrderDialogBuy" class="pointer pl1"
                        onclick="${events}">Buy</span>
                </a>
                <a class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4">
                    <span id="openOrderDialogSell" class="pointer pl1"
                        onclick="${events}">Sell</span>
                </a>
            </div>

            <ohlc-chart class="dn-s"
                data-instrument="${state.selectedInstrument}"
                data-granularity="${state.selectedGranularity}"
                data-data="${state.ohlcInfo.data}"
                data-feed="${state.ohlcInfo.feed}"
                data-trades="${state.ohlcInfo.trades}">
            </ohlc-chart>

            <order-dialog></order-dialog>
        `;
            /* eslint-enable indent */

            // Due to a FF bug removed selected="${state.selectedInstrument === instrument}"
            // see also https://github.com/WebReflection/hyperHTML/issues/148
            document.querySelector(`option[value='${state.selectedInstrument}']`).selected = true;
            document.querySelector(`option[value='${state.selectedGranularity}']`).selected = true;
        }
    }

    class ToastsService {
        constructor(toasts) {
            if (!ToastsService.toasts) {
                ToastsService.toasts = toasts;
            }
        }

        static getToasts() {
            return ToastsService.toasts;
        }

        static addToast(message) {
            ToastsService.toasts.splice(0, 0, {
                date: (new Date()),
                message
            });

            if (ToastsService.timeout) {
                clearTimeout(ToastsService.timeout);
            }
            ToastsService.timeout = ToastsService.reset();
        }

        static reset() {
            return setTimeout(() => {
                while (ToastsService.toasts.length) {
                    ToastsService.toasts.pop();
                }
            }, 10000);
        }
    }

    ToastsService.toasts = null;
    ToastsService.timeout = null;

    class ChartsService {
        constructor(candles) {
            if (!ChartsService.candles) {
                ChartsService.candles = candles;
            }
        }

        static getHistQuotes({
            instrument = "EUR_USD",
            granularity = "M5",
            count = 251,
            dailyAlignment = "0"
        } = {}) {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return null;
            }

            return Util.fetch("/api/candles", {
                method: "post",
                body: JSON.stringify({
                    environment: credentials.environment,
                    token: credentials.token,
                    instrument,
                    granularity,
                    count,
                    dailyAlignment
                })
            }).then(res => res.text()).then(data => {
                ChartsService.candles.csv = data;
            }).catch(err => {
                ToastsService.addToast(err.data);
            });
        }
    }

    ChartsService.candles = null;

    class OrderDialogTemplate {
        static update(render, state, events) {
            if (!state.orderModalIsOpen) {
                Util.renderEmpty(render);
                return;
            }

            OrderDialogTemplate.renderOrderModal(render, state, events);
        }

        static renderOrderModal(render, state, events) {
            /* eslint-disable indent */
            render`
            <div class="fixed absolute--fill bg-black-70 z5">
            <div class="fixed absolute-center z999">

            <main class="pa4 black-80 bg-white">
                <form class="measure center">
                    <fieldset id="order" class="ba b--transparent ph0 mh0">
                        <legend class="f4 fw6 ph0 mh0 center">Order Dialog</legend>

                        <div class="flex flex-row justify-between vh-50">

                            <div class="flex flex-column items-start justify-between ma2">

                                <div>
                                    <input type="radio" name="marketOrder" value="MARKET"
                                        checked="${state.orderInfo.type === "MARKET"}"
                                        onchange="${e => {
                                            state.orderInfo.type = e.target.value.trim();
                                        }}">
                                    <label for="marketOrder" class="lh-copy">Market</label>
                                    <input type="radio" name="marketOrder" value="LIMIT"
                                        checked="${state.orderInfo.type === "LIMIT"}"
                                        onchange="${e => {
                                            state.orderInfo.type = e.target.value.trim();
                                        }}">
                                    <label for="limitOrder" class="lh-copy">Limit</label>
                                </div>

                                <div>
                                    <input type="radio" name="buy" value="buy"
                                        checked="${state.orderInfo.side === "buy"}"
                                        onchange="${e => {
                                            state.orderInfo.side = e.target.value.trim();
                                        }}">
                                    <label for="buy" class="lh-copy">Buy</label>
                                    <input type="radio" name="sell" value="sell"
                                        checked="${state.orderInfo.side === "sell"}"
                                        onchange="${e => {
                                            state.orderInfo.side = e.target.value.trim();
                                        }}">
                                    <label for="sell" class="lh-copy">Sell</label>
                                </div>

                                <div>
                                    <select id="market" onchange="${e => events(e,
                                            e.target.value.trim())}">${

                                        state.orderInfo.instruments.map(instrument => hyperHTML.wire()`
                                        <option value="${instrument}" selected="${state.orderInfo.selectedInstrument === instrument}">
                                            ${instrument}
                                        </option>
                                    `)}</select>
                                </div>

                                <input class="mw4" placeholder="Units" name="units" type="number"
                                    value="${state.orderInfo.units}"
                                    oninput="${e => {
                                        state.orderInfo.units = e.target.value.trim();
                                    }}">

                                <div class="w4">
                                    <label for="quote" class="lh-copy">Quote</label>
                                    <input class="mw4" placeholder="Quote"
                                        name="quote" type="number"
                                        oninput="${e => {
                                            state.orderInfo.quote = e.target.value.trim();
                                        }}"
                                        disabled="${state.orderInfo.type === "MARKET"}"
                                        step="${state.step}">
                                </div>

                                <div style="${Util.show(state.orderInfo.type === "LIMIT")}">
                                    <select id="expire" onchange="${e => events(e,
                                            e.target.value.trim())}">${

                                        state.orderInfo.expires.map(expiry => hyperHTML.wire()`
                                        <option value="${expiry.value}" selected="${state.orderInfo.selectedExpire === expiry.value}">
                                            ${expiry.label}
                                        </option>
                                    `)}</select>
                                </div>

                            </div>

                            <div class="flex flex-column items-end justify-between ma2">

                                <div>
                                    <input type="radio" name="price" value="price"
                                        checked="${state.orderInfo.measure === "price"}"
                                        onchange="${e => {
                                            state.orderInfo.measure = e.target.value.trim();
                                        }}">
                                    <label for="price" class="lh-copy">Price</label>
                                    <input type="radio" name="pips" value="pips"
                                        checked="${state.orderInfo.measure === "pips"}"
                                        onchange="${e => {
                                            state.orderInfo.measure = e.target.value.trim();
                                        }}">
                                    <label for="pips" class="lh-copy">PIPS</label>
                                </div>

                                <div class="w4">
                                    <input type="checkbox" checked="${state.orderInfo.isLowerBound}"
                                        onchange="${e => {
                                            state.orderInfo.isLowerBound = e.target.checked;
                                        }}">
                                    <label for="lowerBound" class="lh-copy">Lower Bound</label>
                                    <input class="mw4" placeholder="Lower Bound"
                                        name="lowerBound" type="number" min="0"
                                        oninput="${e => {
                                            state.orderInfo.lowerBound = e.target.value.trim();
                                        }}"
                                        disabled="${!state.orderInfo.isLowerBound}"
                                        step="${state.orderInfo.step}">
                                </div>

                                <div class="w4">
                                    <input type="checkbox" checked="${state.orderInfo.isUpperBound}"
                                        onchange="${e => {
                                            state.orderInfo.isUpperBound = e.target.checked;
                                        }}">
                                    <label for="upperBound" class="lh-copy">Upper Bound</label>
                                    <input class="mw4" placeholder="Upper Bound"
                                        name="upperBound" type="number" min="0"
                                        oninput="${e => {
                                            state.orderInfo.upperBound = e.target.value.trim();
                                        }}"
                                        disabled="${!state.orderInfo.isUpperBound}"
                                        step="${state.orderInfo.step}">
                                </div>

                                <div class="w4">
                                    <input type="checkbox" checked="${state.orderInfo.isTakeProfit}"
                                        onchange="${e => {
                                            state.orderInfo.isTakeProfit = e.target.checked;
                                        }}">
                                    <label for="takeProfit" class="lh-copy">Take Profit</label>
                                    <input class="mw4" placeholder="Take Profit"
                                        name="takeProfit" type="number" min="0"
                                        oninput="${e => {
                                            state.orderInfo.takeProfit = e.target.value.trim();
                                        }}"
                                        disabled="${!state.orderInfo.isTakeProfit}"
                                        step="${state.orderInfo.step}">
                                </div>

                                <div class="w4">
                                    <input type="checkbox" checked="${state.orderInfo.isStopLoss}"
                                        onchange="${e => {
                                            state.orderInfo.isStopLoss = e.target.checked;
                                        }}">
                                    <label for="stopLoss" class="lh-copy">Stop Loss</label>
                                    <input class="mw4" placeholder="Stop Loss"
                                        name="stopLoss" type="number" min="0"
                                        oninput="${e => {
                                            state.orderInfo.stopLoss = e.target.value.trim();
                                        }}"
                                        disabled="${!state.orderInfo.isStopLoss}"
                                        step="${state.orderInfo.step}">
                                </div>

                                <div class="w4">
                                    <input type="checkbox" checked="${state.orderInfo.isTrailingStop}"
                                        onchange="${e => {
                                            state.orderInfo.isTrailingStop = e.target.checked;
                                        }}">
                                    <label for="trailingStop" class="lh-copy">Trailing Stop</label>
                                    <input class="mw4" placeholder="Trailing Stop"
                                        name="trailingStop" type="number" min="0"
                                        oninput="${e => {
                                            state.orderInfo.trailingStop = e.target.value.trim();
                                        }}"
                                        disabled="${!state.orderInfo.isTrailingStop}"
                                        step="${state.orderInfo.step}">
                                </div>

                            </div>

                        </div>

                    </fieldset>

                    <div class="flex flex-row items-center justify-around">
                        <input id="orderSubmit" class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="button" value="Submit" onclick="${events}">

                        <input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="button" value="Close"
                            onclick="${() => {
                                state.orderModalIsOpen = false;
                            }}">
                    </div>

                </form>
            </main>

            </div>
            </div>
        `;
            /* eslint-enable indent */
        }

    }

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

    class OrderDialogController {
        constructor(render, template, bindings) {
            const events = (e, payload) => Util.handleEvent(this, e, payload);

            this.state = Introspected.observe(bindings,
                state => template.update(render, state, events));

            const account = AccountsService.getAccount();

            this.pips = account.pips;

            this.onMarketChange(null, this.state.selectedInstrument);
        }

        onMarketChange(e, instrument) {
            if (!this.pips) {
                return;
            }

            this.state.selectedInstrument = instrument;

            const price = QuotesService.getQuotes()[instrument],
                fixed = ((this.pips[this.state.selectedInstrument].toString())
                    .match(/0/g) || []).length;

            this.state.measure = "price";
            this.state.step = parseFloat(this.pips[this.state.selectedInstrument]);
            if (this.state.orderInfo.side === "buy") {
                this.state.quote = parseFloat(price && price.ask);
                this.takeProfit = parseFloat((this.state.quote + this.state.step * 10)
                    .toFixed(fixed));
                this.stopLoss = parseFloat((this.state.quote - this.state.step * 10)
                    .toFixed(fixed));
            } else {
                this.state.quote = parseFloat(price && price.bid);
                this.takeProfit = parseFloat((this.state.quote - this.state.step * 10)
                    .toFixed(fixed));
                this.stopLoss = parseFloat((this.state.quote + this.state.step * 10)
                    .toFixed(fixed));
            }
            this.lowerBound = parseFloat((this.state.quote - this.state.step).toFixed(fixed));
            this.upperBound = parseFloat((this.state.quote + this.state.step).toFixed(fixed));
            this.trailingStop = 25;
        }

        changeMeasure(measure) {
            if (measure === "price") {
                this.onMarketChange(null, this.state.selectedInstrument);
            } else {
                this.lowerBound = 1;
                this.upperBound = 1;
                this.takeProfit = 10;
                this.stopLoss = 10;
                this.trailingStop = 25;
                this.state.step = 1;
            }
        }

        onOrderSubmitClick() {
            this.state.orderModalIsOpen = false;

            if (!this.pips) {
                ToastsService.addToast(`Pips info for ${this.state.selectedInstrument} not yet available. Retry.`);

                return;
            }

            const order = {},
                isBuy = this.state.orderInfo.side === "buy",
                isMeasurePips = this.state.measure === "pips";

            this.state.orderInfo.step = parseFloat(this.pips[this.state.selectedInstrument]);

            order.instrument = this.state.selectedInstrument;
            order.units = this.state.orderInfo.units;
            if (this.state.orderInfo.units && !isBuy) {
                order.units = `-${order.units}`;
            }

            order.side = this.state.orderInfo.side;
            order.type = this.state.orderInfo.type;

            if (order.type === "LIMIT") {
                order.price = this.state.orderInfo.quote && this.state.orderInfo.quote.toString();
                order.gtdTime = new Date(Date.now() + this.state.orderInfo.selectedExpire);
            }

            if (isMeasurePips) {
                if (this.state.orderInfo.isLowerBound) {
                    order.priceBound =
                        parseFloat((this.state.orderInfo.quote - this.state.orderInfo.step * this.lowerBound)
                            .toString()).toString();
                }
                if (this.state.orderInfo.isUpperBound) {
                    order.priceBound =
                        parseFloat((this.state.orderInfo.quote + this.state.orderInfo.step * this.upperBound)
                            .toString()).toString();
                }
                if (isBuy) {
                    if (this.state.orderInfo.isTakeProfit) {
                        order.takeProfitOnFill = {};
                        order.takeProfitOnFill.price =
                            parseFloat((this.state.orderInfo.quote + this.state.orderInfo.step * this.takeProfit)
                                .toString()).toString();
                    }
                    if (this.state.orderInfo.isStopLoss) {
                        order.stopLossOnFill = {};
                        order.order.takeProfitOnFill.price =
                            parseFloat((this.state.orderInfo.quote - this.state.orderInfo.step * this.stopLoss)
                                .toString()).toString();
                    }
                } else {
                    if (this.state.orderInfo.isTakeProfit) {
                        order.takeProfitOnFill = {};
                        order.takeProfitOnFill.price =
                            parseFloat((this.state.orderInfo.quote - this.state.orderInfo.step * this.takeProfit)
                                .toString()).toString();
                    }
                    if (this.state.orderInfo.isStopLoss) {
                        order.stopLossOnFill = {};
                        order.order.takeProfitOnFill.price =
                            parseFloat((this.state.orderInfo.quote + this.state.orderInfo.step * this.stopLoss)
                                .toString()).toString();
                    }
                }
            } else {
                if (this.state.orderInfo.isLowerBound) {
                    order.priceBound = this.lowerBound.toString();
                }
                if (this.state.orderInfo.isUpperBound) {
                    order.priceBound = this.upperBound.toString();
                }
                if (this.state.orderInfo.isTakeProfit) {
                    order.takeProfitOnFill = {};
                    order.takeProfitOnFill.price = this.takeProfit.toString();
                }
                if (this.state.orderInfo.isStopLoss) {
                    order.stopLossOnFill = {};
                    order.stopLossOnFill.price = this.stopLoss.toString();
                }
            }
            if (this.state.orderInfo.isTrailingStop) {
                order.trailingStopLossOnFill = {};
                order.trailingStopLossOnFill.distance =
                    (this.state.orderInfo.step * this.trailingStop).toString();
            }

            OrdersService.putOrder(order).then(transaction => {
                let opened,
                    canceled,
                    side,
                    message;

                if (transaction.message) {
                    message = `ERROR ${transaction.message}`;

                    ToastsService.addToast(message);
                } else if (transaction.errorMessage) {
                    message = `ERROR ${transaction.errorMessage}`;

                    ToastsService.addToast(message);
                } else if (transaction.orderCancelTransaction) {
                    canceled = transaction.orderCancelTransaction;

                    message = `ERROR ${canceled.reason}`;

                    ToastsService.addToast(message);
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

                    ToastsService.addToast(message);
                }
            });
        }
    }

    class OrderDialogComponent {
        static bootstrap(state) {
            const render = hyperHTML.bind(Util.query("order-dialog"));

            this.orderDialogController = new OrderDialogController(render, OrderDialogTemplate, state);
        }
    }

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

    class ChartsController {
        constructor(render, template) {
            const events = (e, payload) => Util.handleEvent(this, e, payload);

            this.state = Introspected({
                candles: { csv: "" },
                account: AccountsService.getAccount(),
                selectedGranularity: "M5",
                selectedInstrument: "EUR_USD",
                granularities: [
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
                ],
                orderModalIsOpen: false
            }, state => template.update(render, state, events));

            this.state.orderInfo = {
                side: "buy",
                selectedInstrument: this.state.selectedInstrument,
                instruments: this.state.account.streamingInstruments,
                type: "MARKET",
                units: "",
                quote: "",
                step: 1,
                expires: [
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
                ],
                selectedExpire: 604800000, // 1 week
                measure: "price",
                isLowerBound: false,
                isUpperBound: false,
                isTakeProfit: false,
                isStopLoss: false,
                isTrailingStop: false
            };

            this.chartsService = new ChartsService(this.state.candles);

            this.state.ohlcInfo = {
                data: this.state.candles.csv,
                feed: "",
                trades: ""
            };

            Introspected.observe(QuotesService.getQuotes(), state => {
                if (Object.keys(state).length) {
                    this.state.ohlcInfo.feed = JSON.stringify(state.quotes[this.state.selectedInstrument]);
                }
            });

            Introspected.observe(TradesService.getTrades(), state => {
                if (Object.keys(state.trades).length) {
                    this.state.ohlcInfo.trades = JSON.stringify(state.trades.value);
                }
            });

            this.onChartInstrumentChange(null, {
                instrument: this.state.selectedInstrument,
                granularity: this.state.selectedGranularity
            });

            OrderDialogComponent.bootstrap(this.state);
        }

        onChartInstrumentChange(e, { instrument, granularity }) {
            this.state.selectedInstrument = instrument;
            this.state.selectedGranularity = granularity;

            ChartsService.getHistQuotes({
                instrument,
                granularity
            }).then(() => {
                this.state.ohlcInfo.data = this.state.candles.csv;
            });
        }

        onChartGranularityChange(e, { instrument, granularity }) {
            this.onChartInstrumentChange(e, { instrument, granularity });
        }

        openOrderDialog(side) {
            Object.assign(this.state.orderInfo, {
                side,
                selectedInstrument: this.state.selectedInstrument,
                instruments: this.state.account.streamingInstruments
            });

            this.state.orderModalIsOpen = true;
        }

        onOpenOrderDialogBuyClick() {
            this.openOrderDialog("buy");
        }

        onOpenOrderDialogSellClick() {
            this.openOrderDialog("sell");
        }
    }

    class ChartsComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("charts"));

            this.chartsController = new ChartsController(render, ChartsTemplate);
        }
    }

    class ExposureTemplate {
        static update(render, state) {
            const isNoExposure = Util.hide(state.exposure.length);
            const isExposure = Util.show(state.exposure.length);

            /* eslint-disable indent */
            render`
            <div style="${isNoExposure}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No exposures.</p>
            </div>

            <div style="${isExposure}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Type</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Units</th>
                    </thead>

                    <tbody>${
                        state.exposure.map(exposure => {
                            const classes = "pv1 pr1 bb b--black-20 tr";

                            return hyperHTML.wire(exposure, ":tr")`<tr>
                                <td class="${classes}">${exposure.type}</td>
                                <td class="${classes}">${exposure.market}</td>
                                <td class="${classes}">${Util.formatNumber(exposure.units)}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>
        `;
            /* eslint-enable indent */
        }
    }

    class ExposureController {
        constructor(render, template) {

            this.state = Introspected({
                exposure: []
            }, state => template.update(render, state));

            this.exposureService = new ExposureService(this.state.exposure);
        }
    }

    class ExposureComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("exposure"));

            this.exposureController = new ExposureController(render, ExposureTemplate);
        }
    }

    ExposureComponent.bootstrap();

    class HeaderTemplate {
        static update(render, state, events) {
            /* eslint-disable indent */
            render`
            <nav class="flex flex-row bt bb tc mw9 center shadow-2">

                <div class="flex flex-wrap flex-row justify-around items-center min-w-95">
                        <a class="logo" href="http://argo.js.org/">
                            <img alt="Argo" src="img/logo.png">
                        </a>

                        <span class="b">Argo Interface for OANDA Trading Platform</span>

                        <div style="${Util.show(state.tokenInfo.token)}">
                            Active environment: <span class="b">${state.tokenInfo.environment}</span>
                        </div>

                        <div style="${Util.show(state.tokenInfo.accountId)}">
                            Account Id: <span class="b">${state.tokenInfo.accountId}</span>
                        </div>

                        <div style="${Util.show(!state.tokenInfo.token)}">
                            Please, insert the access token.
                        </div>

                        <a id="openSettings" class="pointer f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4"
                            style="${Util.show(state.tokenInfo.accountId)}"
                            onclick="${events}">
                                Settings
                        </a>
                        <a class="pointer f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4"
                            style="${Util.show(!state.tokenInfo.token)}"
                            onclick="${() => {
                                state.tokenModalIsOpen = true;
                            }}">
                                Token
                        </a>
                </div>

                <div class="flex flex-row items-center min-w-5">
                    <span class="${Util.spinnerState.isLoadingView ? "spinner" : ""}"></span>
                </div>

            </nav>

            <token-dialog></token-dialog>
            <settings-dialog></settings-dialog>
        `;
            /* eslint-enable indent */
        }
    }

    class SettingsDialogTemplate {
        static update(render, state, events) {
            if (!state.settingsModalIsOpen) {
                Util.renderEmpty(render);
                return;
            }

            SettingsDialogTemplate.renderSettingsModal(render, state, events);
        }

        static renderSettingsModal(render, state, events) {
            /* eslint-disable indent */
            render`
            <div class="fixed absolute--fill bg-black-70 z5">
            <div class="fixed absolute-center z999">

            <main class="pa4 black-80 bg-white h5 overflow-y-auto">
                <form class="measure center">
                    <fieldset id="login" class="ba b--transparent ph0 mh0">
                        <legend class="f4 fw6 ph0 mh0 center">Settings Dialog</legend>${
                            Object.keys(state.instrs).map(instrument => {
                                const value = !!state.instrs[instrument];

                                return hyperHTML.wire()`<span class="flex flex-row justify-center justify-around code">
                                        <input id="toggleInstrumentSettings" type="checkbox"
                                            onchange="${e => {
                                                state.instrs[instrument] = e.target.checked;
                                            }}"
                                            checked="${value}"> ${instrument}
                                        </input>
                                    </span>
                                `;
                            })
                    }</fieldset>
                </form>

                <div class="flex flex-row justify-center justify-around">
                    <input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                        type="submit" value="Cancel"
                        onclick="${() => {
                            state.settingsModalIsOpen = false;
                        }}">

                    <input id="settingsOk" class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                        type="submit" value="Ok"
                        onclick="${events}">
                </div>
            </main>

            </div>
            </div>
        `;
            /* eslint-enable indent */
        }

    }

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

    class StreamingService {
        static startStream(data) {
            Util.fetch("/api/startstream", {
                method: "post",
                body: JSON.stringify({
                    environment: data.environment,
                    accessToken: data.accessToken,
                    accountId: data.accountId,
                    instruments: data.instruments
                })
            }).then(() => {
                StreamingService.getStream();
            }).catch(err => {
                ToastsService.addToast(`streaming ${err.message}`);
            });
        }

        static getStream() {
            const ws = new WebSocket("ws://localhost:8000/stream");

            ws.onmessage = event => {
                let data,
                    isTick,
                    tick,
                    isTransaction,
                    transaction,
                    refreshPlugins;

                try {
                    data = JSON.parse(event.data);

                    isTick = data.closeoutAsk && data.closeoutBid;
                    isTransaction = data.accountID;
                    refreshPlugins = data.refreshPlugins;

                    if (isTick) {
                        tick = {
                            time: data.time,
                            instrument: data.instrument,
                            ask: data.asks[0] && data.asks[0].price ||
                                data.closeoutAsk,
                            bid: data.bids[0] && data.bids[0].price ||
                                data.closeoutBid
                        };

                        QuotesService.updateTick(tick);

                        TradesService.updateTrades(tick);
                        OrdersService.updateOrders(tick);
                    }

                    if (isTransaction) {
                        transaction = data;

                        ActivityService.addActivity(transaction);

                        AccountsService.refresh();
                        TradesService.refresh();
                        OrdersService.refresh();
                        PositionsService.refresh();
                    }

                    if (refreshPlugins) {
                        PluginsService.refresh();
                    }
                } catch (e) {

                    // Discard "incomplete" json
                    // console.log(e.name + ": " + e.message);
                }
            };
        }
    }

    class SettingsDialogController {
        constructor(render, template, bindings) {
            const events = (e, payload) => Util.handleEvent(this, e, payload);

            this.state = Introspected.observe(bindings,
                state => template.update(render, state, events));
        }

        onSettingsOkClick() {
            const credentials = SessionService.isLogged();

            this.state.settingsModalIsOpen = false;

            if (!credentials) {
                return;
            }

            window.localStorage.setItem("argo.instruments", JSON.stringify(this.state.instrs));

            const instruments = AccountsService.setStreamingInstruments(this.state.instrs);

            QuotesService.reset();

            StreamingService.startStream({
                environment: credentials.environment,
                accessToken: credentials.token,
                accountId: credentials.accountId,
                instruments
            });
        }
    }

    class SettingsDialogComponent {
        static bootstrap(state) {
            const render = hyperHTML.bind(Util.query("settings-dialog"));

            this.settingsDialogController = new SettingsDialogController(render, SettingsDialogTemplate, state);
        }
    }

    class TokenDialogTemplate {
        static update(render, state, events) {
            if (!state.tokenModalIsOpen) {
                Util.renderEmpty(render);
                return;
            }

            if (!state.accounts.length) {
                TokenDialogTemplate.renderTokenModal(render, state, events);
            } else {
                TokenDialogTemplate.renderAccountsListModal(render, state, events);
            }
        }

        static renderTokenModal(render, state, events) {
            /* eslint-disable indent */
            render`
            <div class="fixed absolute--fill bg-black-70 z5">
            <div class="fixed absolute-center z999">

            <main class="pa4 black-80 bg-white">
                <form class="measure center">
                    <fieldset id="login" class="ba b--transparent ph0 mh0">
                        <legend class="f4 fw6 ph0 mh0 center">Token Dialog</legend>

                        <div class="flex flex-row items-center mb2 justify-between">
                            <label for="practice" class="lh-copy">Practice</label>
                            <input class="mr2" type="radio" name="environment" value="practice"
                                checked="${state.tokenInfo.environment === "practice"}"
                                onchange="${e => {
                                    state.tokenInfo.environment = e.target.value.trim();
                                }}">

                        </div>
                        <div class="flex flex-row items-center justify-between mb2">
                            <label for="live" class="lh-copy">Live</label>
                            <input class="mr2" type="radio" name="environment" value="live"
                                checked="${state.tokenInfo.environment === "live"}"
                                onchange="${e => {
                                    state.tokenInfo.environment = e.target.value.trim();
                                }}">
                        </div>

                        <div class="mv3">
                            <input class="b pa2 ba bg-transparent w-100"
                                placeholder="Token" name="token" id="token"
                                oninput="${e => {
                                    state.tokenInfo.token = e.target.value.trim();
                                }}">
                        </div>
                    </fieldset>

                    <div class="flex flex-row items-center justify-around">
                        <input id="loginCancel" class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="button" value="Cancel"
                            onclick="${() => {
                                state.tokenModalIsOpen = false;
                                state.tokenInfo.token = "";
                            }}">

                        <input id="loginOk" class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="button" value="Ok"
                            onclick="${events}">
                    </div>
                </form>
            </main>

            </div>
            </div>
        `;
            /* eslint-enable indent */
        }

        static renderAccountsListModal(render, state, events) {
            /* eslint-disable indent */
            render`
            <div class="fixed absolute--fill bg-black-70 z5">
            <div class="fixed absolute-center z999">

            <main class="pa4 black-80 bg-white">
                <form class="measure center">
                    <fieldset id="login" class="ba b--transparent ph0 mh0">
                        <legend class="f4 fw6 ph0 mh0 center">Accounts List</legend>
                    </fieldset>

                    <div class="flex flex-row items-center justify-around">${
                        state.accounts.map((account, index) => hyperHTML.wire(account, ":li")`
                            <input id="${`selectAccount-${index}`}"
                                class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="button" value="${account.id}"
                                onclick="${e => events(e, index)}">
                    `)}</div>
                </form>
            </main>

            </div>
            </div>
        `;
            /* eslint-enable indent */
        }
    }

    class NewsService {
        constructor(news) {
            if (!NewsService.news) {
                NewsService.news = news;
            }
        }

        static refresh() {
            const credentials = SessionService.isLogged();

            if (!credentials) {
                return;
            }

            Util.fetch("/api/calendar", {
                method: "post",
                body: JSON.stringify({
                    environment: credentials.environment,
                    token: credentials.token
                })
            }).then(res => res.json()).then(data => {
                NewsService.news.splice(0, NewsService.news.length);

                data.forEach(news => {
                    news.timestamp *= 1000;
                    NewsService.news.push(news);
                });
            }).catch(err => err.data);
        }
    }

    NewsService.news = null;

    class TokenDialogController {
        constructor(render, template, bindings) {
            const events = (e, payload) => Util.handleEvent(this, e, payload);

            this.state = Introspected.observe(bindings,
                state => template.update(render, state, events));
        }

        onLoginOkClick() {
            AccountsService.getAccounts({
                environment: this.state.tokenInfo.environment,
                token: this.state.tokenInfo.token
            }).then(accounts => {
                const message = "If your account id contains only digits " +
                    "(ie. 2534233), it is a legacy account and you should use " +
                    "release 3.x. For v20 accounts use release 4.x or higher. " +
                    "Check your token.";

                if (!accounts.length) {
                    throw new Error(message);
                }
                accounts.forEach(item => {
                    this.state.accounts.push(item);
                });
            }).catch(err => {
                this.state.tokenModalIsOpen = false;
                this.state.tokenInfo.token = "";
                ToastsService.addToast(err);
            });
        }

        onSelectAccountClick(e, accountSelected) {
            this.state.tokenInfo.accountId = this.state.accounts[accountSelected].id;

            const tokenInfo = {
                environment: this.state.tokenInfo.environment,
                token: this.state.tokenInfo.token,
                accountId: this.state.tokenInfo.accountId,
                instrs: this.state.instrs
            };

            SessionService.setCredentials(tokenInfo);

            AccountsService.getAccounts(tokenInfo).then(() => {
                const instruments = AccountsService
                    .setStreamingInstruments(this.state.instrs);

                StreamingService.startStream({
                    environment: tokenInfo.environment,
                    accessToken: tokenInfo.token,
                    accountId: tokenInfo.accountId,
                    instruments
                });

                ActivityService.refresh();
                TradesService.refresh();
                OrdersService.refresh();
                PositionsService.refresh();
                ExposureService.refresh();
                NewsService.refresh();

                ChartsComponent.bootstrap();

                this.state.tokenModalIsOpen = false;
            }).catch(err => {
                ToastsService.addToast(err);
                this.state.tokenModalIsOpen = false;
            });
        }

    }

    class TokenDialogComponent {
        static bootstrap(state) {
            const render = hyperHTML.bind(Util.query("token-dialog"));

            this.tokenDialogController = new TokenDialogController(render, TokenDialogTemplate, state);
        }
    }

    class HeaderController {
        constructor(render, template) {
            const events = (e, payload) => Util.handleEvent(this, e, payload);

            const instrsStorage = window.localStorage.getItem("argo.instruments");

            const instrs = JSON.parse(instrsStorage) || {
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

            this.state = Introspected({
                spinner: {
                    isLoadingView: false
                },
                tokenModalIsOpen: false,
                tokenInfo: {
                    environment: "practice",
                    token: "",
                    accountId: ""
                },
                settingsModalIsOpen: false,
                accounts: [],
                instrs
            }, state => template.update(render, state, events));

            Util.spinnerState = this.state.spinner;

            TokenDialogComponent.bootstrap(this.state);
            SettingsDialogComponent.bootstrap(this.state);
        }

        onOpenSettingsClick() {
            const allInstrs = AccountsService.getAccount().instruments;

            allInstrs.forEach(instrument => {
                if (!this.state.instrs[instrument.name].toString()) {
                    this.state.instrs[instrument.name] = false;
                }
            });

            this.state.settingsModalIsOpen = true;
        }
    }

    class HeaderComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("header"));

            this.HeaderController = new HeaderController(render, HeaderTemplate);
        }
    }

    HeaderComponent.bootstrap();

    class NewsTemplate {
        static update(render, state) {
            const isNoNews = Util.hide(state.news.length);
            const isNews = Util.show(state.news.length);

            /* eslint-disable indent */
            render`
            <div style="${isNoNews}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No news.</p>
            </div>

            <div style="${isNews}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Date/Time</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Event</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Previous</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Forecast</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Actual</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Unit</th>
                    </thead>

                    <tbody>${
                        state.news.map(news => {
                            const classes = "pv1 pr1 bb b--black-20 tr";

                            return hyperHTML.wire(news, ":tr")`<tr>
                                <td class="${classes}">${Util.formatDate(news.timestamp)}</td>
                                <td class="${classes}">${news.currency}</td>
                                <td class="${classes}">${news.title}</td>
                                <td class="${classes}">${Util.formatNumber(news.previous)}</td>
                                <td class="${classes}">${Util.formatNumber(news.forecast)}</td>
                                <td class="${classes}">${Util.formatNumber(news.actual)}</td>
                                <td class="${classes}">${news.unit}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>
        `;
            /* eslint-enable indent */
        }
    }

    class NewsController {
        constructor(render, template) {

            this.state = Introspected({
                news: []
            }, state => template.update(render, state));

            this.newsService = new NewsService(this.state.news);
        }
    }

    class NewsComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("news"));

            this.newsController = new NewsController(render, NewsTemplate);
        }
    }

    NewsComponent.bootstrap();

    class OhlcChartTemplate {

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
                .text(`Price (${myState.myInstrument} / ${myState.myGranularity})`);

            svg.append("g")
                .attr("class", "volume axis");

            svg.append("g")
                .attr("class", "crosshair ohlc");

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

            const data = myState.data;

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
                    data.slice(data.length - 130, data.length)
                ).domain());
                yVolume.domain(techan.scale.plot.volume(
                    data.slice(data.length - 130, data.length)
                ).domain());

                svg.select("g.x.axis").call(xAxis);
                svg.select("g.y.axis").call(yAxis);
                svg.select("g.volume.axis").call(volumeAxis);

                svg.select("g.candlestick").datum(data).call(ohlc);
                svg.select("g.tradearrow").remove();
                svg.append("g").attr("class", "tradearrow");

                const myTrades = myState.myTrades.filter(
                    trade => trade.instrument === myState.myInstrument
                )
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

    class OhlcChartElement extends HTMLElement {
        static get observedAttributes() {
            return ["data-data", "data-feed", "data-trades"];
        }

        constructor() {
            super();

            OhlcChartElement.state = {
                instrument: this.dataset.instrument,
                granularity: this.dataset.granularity,
                data: "",
                feed: {},
                trades: []
            };
        }

        attributeChangedCallback(name) {
            OhlcChartElement.state.instrument = this.dataset.instrument;
            OhlcChartElement.state.granularity = this.dataset.granularity;
            OhlcChartElement.state.data = this.dataset.data;
            OhlcChartElement.state.feed = this.dataset.feed && JSON.parse(this.dataset.feed);
            OhlcChartElement.state.trades = this.dataset.trades ? JSON.parse(this.dataset.trades) : [];

            if (OhlcChartElement.state.feed && typeof OhlcChartElement.state.feed.ask !== "string") {
                OhlcChartElement.state.feed.ask = "";
            }
            if (OhlcChartElement.state.feed && typeof OhlcChartElement.state.feed.bid !== "string") {
                OhlcChartElement.state.feed.bid = "";
            }

            if (name === "data-data") {
                OhlcChartTemplate.redrawData(OhlcChartElement.state);
            }

            if (name === "data-feed" || name === "data-trades") {
                OhlcChartTemplate.redrawFeed(OhlcChartElement.state);
            }
        }

    }
    customElements.define("ohlc-chart", OhlcChartElement);

    OhlcChartElement.state = null;

    class OrdersTemplate {
        static update(render, state) {
            const isNoOrders = Util.hide(state.orders.length);
            const isOrders = Util.show(state.orders.length);

            /* eslint-disable indent */
            render`
            <div style="${isNoOrders}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No orders.</p>
            </div>

            <div style="${isOrders}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Type</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Ticket</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Units</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">S/L</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">T/P</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">T/S</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Price</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Current</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Distance</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Expiry</th>
                    </thead>

                    <tbody>${
                        state.orders.map(order => {
                            const classes = "pv1 pr1 bb b--black-20 tr";

                            return hyperHTML.wire(order, ":tr")`<tr>
                                <td class="${classes}">${order.side || order.type}</td>
                                <td class="${classes}">
                                    <a href="#" onclick="${() => {
                                        state.yesnoModalIsOpen = true;
                                        state.closeOrderInfo.orderId = order.id;
                                    }}">${order.id}</a>
                                </td>
                                <td class="${classes}">${order.instrument}</td>
                                <td class="${classes}">${Util.formatNumber(order.units)}</td>
                                <td class="${classes}">${order.stopLossOnFill.price}</td>
                                <td class="${classes}">${order.takeProfitOnFill.price}</td>
                                <td class="${classes}">${order.trailingStopLossOnFill.distance || order.trailingStopValue}</td>
                                <td class="${classes}">${Util.formatNumber(order.price, 4)}</td>
                                <td class="${classes}">${Util.formatNumber(order.current, 4)}</td>
                                <td class="${classes}">${Util.formatNumber(order.distance, 1)}</td>
                                <td class="${classes}">${Util.formatDate(order.expiry)}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>

            <yesno-dialog></yesno-dialog>
        `;
            /* eslint-enable indent */
        }
    }

    class YesNoDialogTemplate {
        static update(render, state, events) {
            if (!state.yesnoModalIsOpen) {
                Util.renderEmpty(render);
                return;
            }

            /* eslint-disable indent */
            render`
            <div class="fixed absolute--fill bg-black-70 z5">
            <div class="fixed absolute-center z999">

            <main class="pa4 black-80 bg-white">
                <form class="measure center">
                    <fieldset id="textYesNoDialog" id="login" class="ba b--transparent ph0 mh0">
                        <legend class="f4 fw6 ph0 mh0 center">${state.yesnoModalText}</legend>
                    </fieldset>
                </form>
                <div class="flex flex-row items-center justify-around">
                    <input id="cancelYesNoDialog" class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                        type="button" value="Cancel"
                        onclick="${events}">

                    <input id="okYesNoDialog" class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                        type="button" value="Ok"
                        onclick="${events}">
                </div>
                </form>
            </main>

            </div>
            </div>
        `;
            /* eslint-enable indent */
        }
    }

    class YesNoDialogController {
        constructor(render, template, bindings, events) {
            Introspected.observe(bindings,
                state => template.update(render, state, events));
        }
    }

    class YesNoDialogComponent {
        static bootstrap(state, events) {
            const render = hyperHTML.bind(Util.query("yesno-dialog"));

            this.yesnoDialogController = new YesNoDialogController(render, YesNoDialogTemplate, state, events);
        }
    }

    class OrdersController {
        constructor(render, template) {
            const events = (e, payload) => Util.handleEvent(this, e, payload);

            this.state = Introspected({
                orders: [],
                yesnoModalIsOpen: false,
                yesnoModalText: "Are you sure to close the order?",
                closeOrderInfo: {
                    orderId: null
                }
            }, state => template.update(render, state));

            this.ordersService = new OrdersService(this.state.orders);

            YesNoDialogComponent.bootstrap(this.state, events);
        }

        onCancelYesNoDialogClick() {
            this.state.yesnoModalIsOpen = false;
        }

        onOkYesNoDialogClick() {
            this.state.yesnoModalIsOpen = false;

            OrdersService.closeOrder(this.state.closeOrderInfo.orderId).then(order => {
                let message = `Closed #${order.orderCancelTransaction.orderID}`;

                if (order.errorMessage || order.message) {
                    message = `ERROR ${order.errorMessage || order.message}`;
                }

                ToastsService.addToast(message);
            }).catch(err => {
                const message = `ERROR ${err.code} ${err.message}`;

                ToastsService.addToast(message);
            });
        }
    }

    class OrdersComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("orders"));

            this.ordersController = new OrdersController(render, OrdersTemplate);
        }
    }

    OrdersComponent.bootstrap();

    class PluginsTemplate {
        static update(render, state, events) {
            const pluginsKeys = Object.keys(state.plugins);
            const pluginsCount = pluginsKeys.length;
            const isNoPlugins = Util.hide(pluginsCount);
            const isPlugins = Util.show(pluginsCount);

            /* eslint-disable indent */
            render`
            <div style="${isNoPlugins}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No plugins.</p>
            </div>

            <div style="${isPlugins}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Enabled</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white">Plugin</th>
                    </thead>

                    <tbody>${
                        pluginsKeys.map((plugin, index) => {
                            const value = !!state.plugins[plugin];

                            return hyperHTML.wire()`<tr>
                                <td class="pv1 pr1 bb b--black-20 tr">
                                    <input id="${`togglePlugin-${index}`}" type="checkbox"
                                        onchange="${e => events(e, plugin)}"
                                        checked="${value}">
                                    </input>
                                </td>
                                <td class="pv1 pr1 bb b--black-20">${plugin}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>
        `;
            /* eslint-enable indent */
        }
    }

    class PluginsController {
        constructor(render, template) {
            const events = (e, payload) => Util.handleEvent(this, e, payload);

            this.state = Introspected({
                plugins: {},
                pluginsInfo: {
                    count: 0
                }
            }, state => template.update(render, state, events));

            this.pluginService = new PluginsService(this.state);

            PluginsService.refresh();
        }

        onTogglePluginChange(e, plugin) {
            this.state.plugins[plugin] = e.target.checked;
            PluginsService.engagePlugins(this.state.plugins);
        }
    }
    PluginsController.$inject = ["PluginsService"];

    class PluginsComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("plugins"));

            this.pluginsController = new PluginsController(render, PluginsTemplate);
        }
    }

    PluginsComponent.bootstrap();

    class PositionsTemplate {
        static update(render, state) {
            const isNoPositions = Util.hide(state.positions.length);
            const isPositions = Util.show(state.positions.length);

            /* eslint-disable indent */
            render`
            <div style="${isNoPositions}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No positions.</p>
            </div>

            <div style="${isPositions}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Type</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Units</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Avg. Price</th>
                    </thead>

                    <tbody>${
                        state.positions.map(position => {
                            const classes = "pv1 pr1 bb b--black-20 tr";

                            return hyperHTML.wire(position, ":tr")`<tr>
                                <td class="${classes}">${position.side}</td>
                                <td class="${classes}">${position.instrument}</td>
                                <td class="${classes}">${Util.formatNumber(position.units)}</td>
                                <td class="${classes}">${position.avgPrice}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>
        `;
            /* eslint-enable indent */
        }
    }

    class PositionsController {
        constructor(render, template) {

            this.state = Introspected({
                positions: []
            }, state => template.update(render, state));

            this.positionsService = new PositionsService(this.state.positions);
        }
    }

    class PositionsComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("positions"));

            this.positionsController = new PositionsController(render, PositionsTemplate);
        }
    }

    PositionsComponent.bootstrap();

    class QuotesTemplate {
        static update(render, state) {
            if (!Object.keys(state.quotes).length) {
                Util.renderEmpty(render);
                return;
            }

            /* eslint-disable indent */
            render`
            <div class="h5 overflow-auto">

                <table class="collapse f6 w-100 mw8 center">
                    <tbody>${
                        Object.keys(state.quotes).map(instrument => {
                            const quote = state.quotes[instrument];

                            return hyperHTML.wire(quote, ":tr")`<tr>
                                <td class="pv1 pr1 bb b--black-20"> ${instrument} </td>
                                <td class="pv1 pr1 bb b--black-20">
                                    <sl-chart data-instrument="${instrument}" data-quote="${JSON.stringify(quote)}" length="100">
                                        <svg class="sl mw3"></svg>
                                    </sl-chart>
                                </td>
                                <td class="${QuotesTemplate.highlighter(quote.bid, instrument, "bid")}"> ${quote.bid} </td>
                                <td class="${QuotesTemplate.highlighter(quote.ask, instrument, "ask")}"> ${quote.ask} </td>
                                <td class="${QuotesTemplate.highlighter(quote.spread, instrument, "spread")}"> ${quote.spread} </td>
                            </tr>`;
                    })}</tbody>
                </table>
           </div>
        `;
            /* eslint-enable indent */
        }

        static highlighter(value, instrument, type) {
            if (!QuotesTemplate.cache[instrument]) {
                QuotesTemplate.cache[instrument] = {};
            }

            if (!QuotesTemplate.cache[instrument][type]) {
                QuotesTemplate.cache[instrument][type] = {};
            }

            const cache = QuotesTemplate.cache[instrument][type];
            const oldValue = cache.value;

            const classes = "pv1 pr1 bb b--black-20 tr";
            const quoteClasses = `${instrument}-${type} ${classes}`;
            const greenClass = "highlight-green";
            const redClass = "highlight-red";

            if (value === oldValue) {
                return cache.classes || quoteClasses;
            }

            const highlight = value >= oldValue
                ? `${quoteClasses} ${greenClass}`
                : `${quoteClasses} ${redClass}`;

            cache.value = value;
            cache.classes = highlight;

            clearTimeout(cache.timeout);
            cache.timeout = setTimeout(() => {
                const el = document.querySelector(`.${instrument}-${type}`);

                if (el) {
                    el.classList.remove(greenClass);
                    el.classList.remove(redClass);
                    cache.classes = quoteClasses;
                }
            }, 500);

            return highlight;
        }
    }

    QuotesTemplate.cache = {};

    class QuotesController {
        constructor(render, template) {

            this.state = Introspected({
                quotes: {}
            }, state => template.update(render, state));

            this.quotesService = new QuotesService(this.state.quotes);
        }
    }

    class QuotesComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("quotes"));

            this.quotesController = new QuotesController(render, QuotesTemplate);
        }
    }

    QuotesComponent.bootstrap();

    class SlChartTemplate {

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

    class SlChartElement extends HTMLElement {
        static get observedAttributes() {
            return ["data-quote"];
        }

        constructor() {
            super();

            SlChartElement.state = {
                instrument: this.dataset.instrument,
                quotes: QuotesService.getQuotes(),
                length: 100
            };
        }

        /* eslint class-methods-use-this: "off" */
        attributeChangedCallback(attr, oldValue, newValue) {
            SlChartElement.state.instrument = JSON.parse(newValue).instrument;

            SlChartTemplate.redraw(SlChartElement.state);
        }

    }
    customElements.define("sl-chart", SlChartElement);

    SlChartElement.state = null;

    class ToastsTemplate {
        static update(render, state) {
            if (!state.toasts.length) {
                Util.renderEmpty(render);
                return;
            }

            /* eslint-disable indent */
            render`
            <table class="f6 ba" cellspacing="0">
                <tbody>${
                    state.toasts.map(toast => `<tr>
                        <td class="b--black-20 pr2"> ${Util.getHHMMSSfromDate(toast.date)} </td>
                        <td class="b--black-20 pl2"> ${toast.message} </td>
                    </tr>`)}</tbody>
            </table>
        `;
            /* eslint-enable indent */
        }
    }

    class ToastsController {
        constructor(render, template) {

            this.state = Introspected({
                toasts: []
            }, state => template.update(render, state));

            this.ToastsService = new ToastsService(this.state.toasts);
        }
    }

    class ToastsComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("toasts"));

            this.toastsController = new ToastsController(render, ToastsTemplate);
        }
    }

    ToastsComponent.bootstrap();

    class TradesTemplate {
        static update(render, state) {
            const isNoTrades = Util.hide(state.trades.value.length);
            const isTrades = Util.show(state.trades.value.length);

            /* eslint-disable indent */
            render`
            <div style="${isNoTrades}" class="h4 overflow-auto">
                <p class="f6 w-100 mw8 tc b">No trades.</p>
            </div>

            <div style="${isTrades}" class="h4 overflow-auto">
                <table class="f6 w-100 mw8 center" cellpsacing="0">
                    <thead>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Type</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Ticket</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Market</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Units</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">S/L</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">T/P</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">T/S</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Price</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Current</th>
                        <th class="fw6 bb b--black-20 tl pb1 pr1 bg-white tr">Profit (PIPS)</th>
                    </thead>

                    <tbody>${
                        state.trades.value.map(trade => {
                            const classes = "pv1 pr1 bb b--black-20 tr";
                            const highlight = classes +
                                (trade.profitPips >= 0 ? " highlight-green" : " highlight-red");

                            return hyperHTML.wire(trade, ":tr")`<tr>
                                <td class="${classes}">${trade.side}</td>
                                <td class="${classes}">
                                    <a href="#" onclick="${() => {
                                        state.yesnoModalIsOpen = true;
                                        state.closeTradeInfo.tradeId = trade.id;
                                    }}">${trade.id}</a>
                                </td>
                                <td class="${classes}">${trade.instrument}</td>
                                <td class="${classes}">${Util.formatNumber(trade.currentUnits)}</td>
                                <td class="${classes}">${trade.stopLossOrder.price}</td>
                                <td class="${classes}">${trade.takeProfitOrder.price}</td>
                                <td class="${classes}">${trade.trailingStopLossOrder.distance}</td>
                                <td class="${classes}">${trade.price}</td>
                                <td class="${classes}">${trade.current}</td>
                                <td class="${highlight}">${Util.formatNumber(trade.profitPips, 1)}</td>
                            </tr>`;
                    })}</tbody>
                </table>
            </div>

            <yesno-dialog></yesno-dialog>
        `;
            /* eslint-enable indent */
        }
    }

    class TradesController {
        constructor(render, template) {
            const events = (e, payload) => Util.handleEvent(this, e, payload);

            this.state = Introspected({
                trades: {
                    value: []
                },
                yesnoModalIsOpen: false,
                yesnoModalText: "Are you sure to close the trade?",
                closeTradeInfo: {
                    tradeId: null
                }
            }, state => template.update(render, state));

            this.tradesService = new TradesService(this.state.trades);

            YesNoDialogComponent.bootstrap(this.state, events);
        }

        onCancelYesNoDialogClick() {
            this.state.yesnoModalIsOpen = false;
        }

        onOkYesNoDialogClick() {
            this.state.yesnoModalIsOpen = false;

            TradesService.closeTrade(this.state.closeTradeInfo.tradeId).then(trade => {
                let message = "Closed " +
                        `${(trade.units > 0 ? "sell" : "buy")} ` +
                        `${trade.instrument} ` +
                        `#${trade.id} ` +
                        `@${trade.price} ` +
                        `P&L ${trade.pl}`;

                if (trade.errorMessage || trade.message) {
                    message = `ERROR ${trade.errorMessage || trade.message}`;
                }

                ToastsService.addToast(message);
            }).catch(err => {
                const message = `ERROR ${err.code} ${err.message}`;

                ToastsService.addToast(message);
            });
        }
    }

    class TradesComponent {
        static bootstrap() {
            const render = hyperHTML.bind(Util.query("trades"));

            this.tradesController = new TradesController(render, TradesTemplate);
        }
    }

    TradesComponent.bootstrap();

}(hyperHTML,Introspected,d3,techan));
