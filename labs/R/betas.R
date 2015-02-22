require(zoo) # for rollapply

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

eurusd <- read.csv("../dump/dump-EUR_USD.csv", header = FALSE)
usdjpy <- read.csv("../dump/dump-USD_JPY.csv", header = FALSE)
gbpusd <- read.csv("../dump/dump-GBP_USD.csv", header = FALSE)
eurgbp <- read.csv("../dump/dump-EUR_GBP.csv", header = FALSE)
eurjpy <- read.csv("../dump/dump-EUR_JPY.csv", header = FALSE)
usdcad <- read.csv("../dump/dump-USD_CAD.csv", header = FALSE)
audusd <- read.csv("../dump/dump-AUD_USD.csv", header = FALSE)
gbpjpy <- read.csv("../dump/dump-GBP_JPY.csv", header = FALSE)

basket <- data.frame(
    eurusd$V5,
    usdjpy$V5,
    gbpusd$V5,
    eurgbp$V5,
    eurjpy$V5,
    usdcad$V5,
    audusd$V5,
    gbpjpy$V5
)
colnames(basket) <- currencies

fxIndex <- c(100,
    rollapply(rowSums(basket), 2, FUN = function(x) x[2] / x[1] * 100)
)

basket.rets <- data.frame(
    (exp(diff(log(basket$EUR_USD))) - 1) * 100,
    (exp(diff(log(basket$USD_JPY))) - 1) * 100,
    (exp(diff(log(basket$GBP_USD))) - 1) * 100,
    (exp(diff(log(basket$EUR_GBP))) - 1) * 100,
    (exp(diff(log(basket$EUR_JPY))) - 1) * 100,
    (exp(diff(log(basket$USD_CAD))) - 1) * 100,
    (exp(diff(log(basket$AUD_USD))) - 1) * 100,
    (exp(diff(log(basket$GBP_JPY))) - 1) * 100
)
colnames(basket.rets) <- currencies

fxIndex.rets <- (exp(diff(log(fxIndex))) - 1) * 100

fxIndex.var <- var(fxIndex.rets)

basket.beta <- data.frame(
    cov(basket.rets$EUR_USD, fxIndex.rets) / fxIndex.var,
    cov(basket.rets$USD_JPY, fxIndex.rets) / fxIndex.var,
    cov(basket.rets$GBP_USD, fxIndex.rets) / fxIndex.var,
    cov(basket.rets$EUR_GBP, fxIndex.rets) / fxIndex.var,
    cov(basket.rets$EUR_JPY, fxIndex.rets) / fxIndex.var,
    cov(basket.rets$USD_CAD, fxIndex.rets) / fxIndex.var,
    cov(basket.rets$AUD_USD, fxIndex.rets) / fxIndex.var,
    cov(basket.rets$GBP_JPY, fxIndex.rets) / fxIndex.var
)

basket.beta <- rbind(basket.beta, c(
    cor(fxIndex.rets, basket.rets$EUR_USD) ** 2,
    cor(fxIndex.rets, basket.rets$USD_JPY) ** 2,
    cor(fxIndex.rets, basket.rets$GBP_USD) ** 2,
    cor(fxIndex.rets, basket.rets$EUR_GBP) ** 2,
    cor(fxIndex.rets, basket.rets$EUR_JPY) ** 2,
    cor(fxIndex.rets, basket.rets$USD_CAD) ** 2,
    cor(fxIndex.rets, basket.rets$AUD_USD) ** 2,
    cor(fxIndex.rets, basket.rets$GBP_JPY) ** 2
))

colnames(basket.beta) <- currencies
rownames(basket.beta) <- c("beta", "rsquared");

basket.beta <- t(basket.beta)
basket.beta[order(-basket.beta[, "beta"]), ]
