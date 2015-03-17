# ARGO

[![Build Status](https://travis-ci.org/albertosantini/argo.png)](https://travis-ci.org/albertosantini/argo)
[![NGN Dependencies](https://david-dm.org/albertosantini/argo.png)](https://david-dm.org/albertosantini/argo)

Argo is an open source trading platform, connecting directly with [OANDA][]
through the powerful [API][] to develop trading strategies.

## Getting Started

Don't forget the project is in an early state.
You may give a try with the following steps ([Node.js](https://nodejs.org/)
required):

```
$ npm install -g argo-trading
...

$ argo-trading
Argo listening on http://localhost:8000
...
```
Eventually point your web brower to `http://localhost:8000`.

Tested locally with node 0.12.x, AngularJS 1.4.x and Material 0.8.x.

## [Documentation](docs/)

## [Contributing](CONTRIBUTING.md)

## Roadmap

- 1.0.0 Initial release
    - [X] Project skeleton

- 1.1.x - 1.8.x Basic features
    - [X] App layout (1.1.0)
        - [ ] Add a few colors and review stylesheets. :)
        - [X] Add toast for general messages. (1.5.0)
        - [ ] Spinner mask when loading view.
        - [X] Right alignment for numbers. (1.7.1)
    - [X] Token dialog (1.2.0)
        - [ ] Add checkboxes to select instruments.
    - [X] Account view (1.2.0)
        - [ ] Update P&L.
    - [X] Quotes view (1.3.0)
        - [ ] Add spreads
    - [X] Charts view (1.4.0)
        - [X] Add instruments select box. (1.6.1)
        - [X] Add stream feed. (1.6.0)
        - [X] Buy/Sell (market/limit order) dialog. (1.7.0)
        - [X] Fix x axis scale for feeding values. (1.7.5)
    - [X] Trades view (1.5.0)
        - [X] Add current price. (1.7.5)
        - [X] Add closing trade. (1.7.4)
    - [X] Orders view (1.6.0)
        - [X] Add current price. (1.7.5)
        - [X] Add closing order. (1.7.4)
        - [ ] Add modifying order.
        - [X] Add send order errors. (1.7.4)
    - [X] Positions view (1.6.0)
    - [X] Exposure view (1.7.0)
    - [X] Activity view (1.5.0)
    - [X] News view (1.7.0)

- 1.9.x Improve docs and tests

- 2.x Executing trading strategies
    - [ ] To be defined

## Disclaimer

NOT INVESTMENT ADVICE AND WILL LOSE LOTS OF MONEY SO PROCEED WITH CAUTION.


[OANDA]: http://fxtrade.oanda.co.uk/
[API]: http://developer.oanda.com/

