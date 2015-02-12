ARGO
====

Argo is the ship captained by Jason in Greek mythology.

This is my quest for the Golden Fleece, building an HTML5 interface for the
OANDA fxTrade platform.

Installation
------------

For Argo working in progress interface:

```
$ git clone git@github.com:albertosantini/argo.git
$ cd argo
$ npm install

$ node server.js
```

Then in `lib` folder there are a few scripts, wrapping OANDA APIs.

Tested locally with node 0.12.x, AngularJS 1.4.x and Material 0.8.0-rc1.

UI Views details
----------------

- Trades

    - TYPE
    - TICKET
    - MARKET
    - UNITS
    - S/L
    - T/P
    - T/S
    - PRICECURRENT
    - PROFIT
    - PROFIT (USD)
    - PROFIT (PIPS)
    - PROFIT (%)
    - DATE

- Orders

    - TYPE
    - TICKET
    - MARKET
    - UNITS
    - S/L
    - T/P
    - T/S
    - PRICE
    - CURRENT
    - DISTANCE
    - EXPIRY

- Positions

    - TYPE
    - MARKET
    - UNITS
    - EXPOSURE (USD)
    - AVG. PRICE
    - CURRENT
    - PROFIT
    - PROFIT (USD)
    - PROFIT (PIPS)
    - PROFIT (%)

- Exposure

    - TYPE
    - MARKET
    - UNITS
    - USD

- Activity

    - TICKET
    - TYPE
    - MARKET
    - UNITS
    - PRICE
    - PROFIT (USD)
    - PROFIT (PIPS)
    - PROFIT (%)
    - BALANCE
    - DATE/TIME

- News

    - DATE/TIME
    - COUNTRY
    - EVENT
    - PREVIOUS
    - FORECAST
    - ACTUAL
    - UNIT

- Account Summary

    - Balance
    - Unrealized P&L
    - Unrealized P&L (%)
    - Net Asset Value
    - Margin Alert
    - Realized P&L
    - Margin Used
    - Margin Available
    - Margin Closeout Value
    - Margin Closeout Percent (%)
    - Position Value

- Quote List

    - Symbol
    - Direction
    - Bid/Ask
    - Spread

- Charts

    - Candlestick chart

References
----------

- [OANDA on GitHub](https://github.com/oanda)
- [OANDA Rest APIs](http://developer.oanda.com/rest-live/introduction/)
- [OANDA Adapter](https://github.com/Cloud9Trader/oanda-adapter)
- [rio R Adapter](https://github.com/albertosantini/node-rio)

- [Material design for Angular](https://github.com/angular/material)
- [Papa's AngularJS style guide](https://github.com/johnpapa/angularjs-styleguide)

Disclaimer
----------

NOT INVESTMENT ADVICE AND WILL LOSE LOTS OF MONEY SO PROCEED WITH CAUTION.

