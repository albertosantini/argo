# ARGO

[![NPM version](https://badge.fury.io/js/argo-trading.png)](http://badge.fury.io/js/argo-trading)
[![NGN Dependencies](https://david-dm.org/albertosantini/argo.png)](https://david-dm.org/albertosantini/argo)
[![Build Status](https://travis-ci.org/albertosantini/argo.png)](https://travis-ci.org/albertosantini/argo)

Argo is an open source trading platform, connecting directly with [OANDA][]
through the powerful [API][] to develop trading strategies.

## Getting Started

You may give a try with the following steps ([Node.js](https://nodejs.org/) or [io.js](https://iojs.org/)
required):

```
$ npm install -g argo-trading
...

$ argo-trading
...
```
Eventually point your web brower to `http://localhost:8000`.

Tested locally with Node.js 0.12.x (and io.js 1.8.x), AngularJS 1.4.x and Material 0.9.x.

## [Documentation](docs/)

## [Contributing](CONTRIBUTING.md)

## Roadmap

- [X] 1.0.0 Initial release.
- [X] 1.1.x - 1.8.x [Basic features](docs/views).
- [ ] 1.9.x Improve docs, tests and graphics.
- [ ] 2.x Executing trading strategies.

## Features

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

## Disclaimer

NOT INVESTMENT ADVICE AND WILL LOSE LOTS OF MONEY SO PROCEED WITH CAUTION.


[OANDA]: http://fxtrade.oanda.co.uk/
[API]: http://developer.oanda.com/
