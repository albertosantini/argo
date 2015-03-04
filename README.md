# ARGO

[![Build Status](https://travis-ci.org/albertosantini/argo.png)](https://travis-ci.org/albertosantini/argo)
[![NGN Dependencies](https://david-dm.org/albertosantini/argo.png)](https://david-dm.org/albertosantini/argo)

Argo is an open source trading platform, connecting directly with [OANDA][]
through the powerful [API][] to develop trading strategies.

## Getting Started

Don't forget the project is in an early state.
You may give a try with the following steps:

```
$ git clone git@github.com:albertosantini/argo.git
$ cd argo
$ npm install
...

$ npm start
Argo listening on http://localhost:8000
...
```
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
    - [X] Token dialog (1.2.0)
        - [ ] Add checkboxes to select instruments.
    - [X] Account view (1.2.0)
        - [ ] Update view w.r.t. trades p/l.
    - [X] Quotes view (1.3.0)
        - [ ] Add spreads?
        - [ ] Add a sparkline?
    - [X] Charts view (1.4.0)
        - [ ] Add instruments select box.
        - [X] Add stream feed.
    - [ ] Buy/Sell view
    - [X] Trades view (1.5.0)
    - [ ] Orders view
    - [ ] Positions view
    - [ ] Exposure view
    - [X] Activity view (1.5.0)
    - [ ] News view

- 1.9.x Improve docs and tests

- 2.x Executing trading strategies
    - [ ] To be defined

## Disclaimer

NOT INVESTMENT ADVICE AND WILL LOSE LOTS OF MONEY SO PROCEED WITH CAUTION.


[OANDA]: http://fxtrade.oanda.co.uk/
[API]: http://developer.oanda.com/

