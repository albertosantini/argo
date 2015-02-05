# Stats summary

currencies <- c(
    "EUR_USD",
    "USD_JPY",
    "GBP_USD",
    "EUR_GBP",
    "EUR_JPY",
    "USD_CAD",
    "AUD_USD",
    "GBP_JPY"
)

pip <- data.frame(
    0.0001,
    0.01,
    0.0001,
    0.0001,
    0.01,
    0.0001,
    0.0001,
    0.01
)
colnames(pip) <- currencies

eurusd <- read.csv("../dump/dump-EUR_USD.csv", header = FALSE)
usdjpy <- read.csv("../dump/dump-USD_JPY.csv", header = FALSE)
gbpusd <- read.csv("../dump/dump-GBP_USD.csv", header = FALSE)
eurgbp <- read.csv("../dump/dump-EUR_GBP.csv", header = FALSE)
eurjpy <- read.csv("../dump/dump-EUR_JPY.csv", header = FALSE)
usdcad <- read.csv("../dump/dump-USD_CAD.csv", header = FALSE)
audusd <- read.csv("../dump/dump-AUD_USD.csv", header = FALSE)
gbpjpy <- read.csv("../dump/dump-GBP_JPY.csv", header = FALSE)

getSummary <- function(currency, x) {
    volatility1 <- (x$V3 - x$V4) / pip[[currency]]
    volatility2 <- abs(x$V2 - x$V5) / pip[[currency]]

    list(
        volatility.currency = currency,
        volatility.HC = summary(volatility1),
        volatility.OC = summary(volatility2)
    )
}

getSummary(currencies[1], eurusd)
getSummary(currencies[2], usdjpy)
getSummary(currencies[3], gbpusd)
getSummary(currencies[4], eurgbp)
getSummary(currencies[5], eurjpy)
getSummary(currencies[6], usdcad)
getSummary(currencies[7], audusd)
getSummary(currencies[8], gbpjpy)
