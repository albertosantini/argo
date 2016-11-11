# ARGO

[![NPM version](https://badge.fury.io/js/argo-trading.png)](http://badge.fury.io/js/argo-trading)
[![NGN Dependencies](https://david-dm.org/albertosantini/argo.png)](https://david-dm.org/albertosantini/argo)
[![Build Status](https://travis-ci.org/albertosantini/argo.png)](https://travis-ci.org/albertosantini/argo)
[![Known Vulnerabilities](https://snyk.io/test/npm/argo-trading/badge.svg)](https://snyk.io/test/npm/argo-trading)

**Argo** is an open source trading platform, connecting directly with [OANDA][]
through the powerful [API][] to develop trading strategies.

## Installation

[![NPM](https://nodei.co/npm/argo-trading.png?downloads=true&downloadRank=true)](https://nodei.co/npm/argo-trading/)
[![NPM](https://nodei.co/npm-dl/argo-trading.png)](https://nodei.co/npm/argo-trading/)

After installing [Node.js](https://nodejs.org/) (required), you can install **Argo**.

Release 3.x for legacy accounts.
Release 4.x (or higher) for v20 account.

```
$ npm install -g argo-trading
```

## Starting Web App

```
$ argo-trading
```
Eventually point your web brower to `http://localhost:8000`.

## Starting Standalone App

```
$ argo-trading-standalone
```

Tested locally with Node.js 6.x, AngularJS 1.5.x and Material 1.x.

## [Basic features](docs/views)

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

## [Advanced features](https://github.com/albertosantini/argo-trading-plugin-seed)

- Executing trading strategies.

## [Documentation](http://argo.rtfd.io/)

## [Contributing](CONTRIBUTING.md)

## Disclaimer

NOT INVESTMENT ADVICE AND WILL LOSE LOTS OF MONEY SO PROCEED WITH CAUTION.


[OANDA]: http://fxtrade.oanda.co.uk/
[API]: http://developer.oanda.com/
