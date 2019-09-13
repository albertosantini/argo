# ARGO

[![NPM version](https://badge.fury.io/js/argo-trading.svg)](http://badge.fury.io/js/argo-trading)
![](https://github.com/albertosantini/argo/workflows/Node%20CI/badge.svg)

**Argo** is an open source trading platform, connecting directly with [OANDA][]
through the powerful [API][] to develop trading strategies.

## Installation

After installing [Node.js](https://nodejs.org/) (required), you can install **Argo**.

- Release 3.x for legacy accounts: if your account id contains only digits (ie. 2534233), it is a legacy account.
- Release 4.x (or higher) for v20 accounts.

```
$ npm install -g argo-trading
```

## Starting Web App

```
$ argo-trading
```
Eventually point your web brower to `http://localhost:8000`.

Finally you need to point to the `host` and `port` defined by `ARGO_PORT` environment variable (`8000` is the default) where you started `argo` 

## Starting Standalone App

```
$ argo-trading-standalone
```

Tested locally with Node.js 10.x, hyperHTML 2.x.

## Basic features

- Account summary updated for each event.
- Quotes and spreads list updated tick-by-tick.
- Charts with different time frames updated tick-by-tick.
- Market and limit orders with stop loss, take profit and trailing stop.
- Trades list with current and profit updated tick-by-tick.
- Orders list with distance updated tick-by-tick.
- Positions summary.
- Expositions summary.
- Transactions history.
- Economic calendar.

## Advanced features

- Executing trading strategies with [plugins](https://github.com/albertosantini/argo-trading-plugin-seed).

## [Documentation](http://argo.js.org/docs/)

## [Contributing](CONTRIBUTING.md)

## Disclaimer

NOT INVESTMENT ADVICE AND WILL LOSE LOTS OF MONEY SO PROCEED WITH CAUTION.


[OANDA]: http://fxtrade.oanda.co.uk/
[API]: http://developer.oanda.com/
