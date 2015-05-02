# Charts

## OHLC chart

The currency rate chart shows how currency exchange rates change over a period
of time ranging from seconds to months. The chart is updated in real time as
OANDA sends out the latest currency rates.

The default chart is an OHLC (Open-High-Low-Close) Bar. It shows highs and lows
for each period using a vertical bar, with a horizontal tick to the right
showing the closing mid-price. It also provides a horizontal tick to the left,
showing the opening mid-price for the period.

There are two drop-down menus to choose the currency pair and time frame
granularity. At top left, there is a text displaying the choice of the actual
chart.

## Order dialog

Clicking on the Buy/Sell button, you issue Market Orders or Limit Orders for
either buy or sell trades from the Buy/Sell dialog. A Market Order is the
default type.

- **Market/Limit order** Types of Orders.

- **Buy/Sell** Choose between buy (long) and sell (short).

- **Market** Choose the currency pair you wish to buy or sell from the pull-down
menu.

- **Units** The number of units of the currency pair you wish to buy or sell,
expressed in terms of the base currency of the pair.

- **Quote** The target rate in a limit order. The order will request a trade
when the exchange rate for the selected currency crosses this target rate. Read-
only for a market order, the most recent exchange rate.

- **Expire** The amount of time before the limit order will expire.
Available only for a limit order.

- **Price/PIPS** Shows units in either the price, or in the number of pips from
the current price.

- **Lower Bound** The order will result in a trade only if the recent exchange
rate is higher than or equal to this limit.

- **Upper Bound** The order will result in a trade only if the recent exchange
rate is lower than or equal to this limit.

- **Take Profit**  Setting a take profit it closes a position at a specified
profit.

- **Stop Loss** Setting a stop loss it closes a position at a specified
loss.

- **Trailing Stop** A stop loss that can be set at a defined pips away from a
current market price.

Market orders are executed when they are submitted. They are executed at the
current market price, unless it's outside of upper and lower bounds optionally
set by the user.

Limit Orders are executed when the exchange rate reaches a specified threshold,
before a specified expiry period.

When you are ready, click the Submit button.

The Trades (or Orders) and Activity views are updated and the aggregated effects
from this new trade are reflected in the Positions and Exposure views.
