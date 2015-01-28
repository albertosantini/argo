eurusd <- read.csv("../dump/dump-EUR_USD.csv", header = FALSE)
usdjpy <- read.csv("../dump/dump-USD_JPY.csv", header = FALSE)
gbpusd <- read.csv("../dump/dump-GBP_USD.csv", header = FALSE)
eurgbp <- read.csv("../dump/dump-EUR_GBP.csv", header = FALSE)
eurjpy <- read.csv("../dump/dump-EUR_JPY.csv", header = FALSE)
usdcad <- read.csv("../dump/dump-USD_CAD.csv", header = FALSE)
audusd <- read.csv("../dump/dump-AUD_USD.csv", header = FALSE)
gbpjpy <- read.csv("../dump/dump-GBP_JPY.csv", header = FALSE)

eurusd.close <- eurusd$V5
usdjpy.close <- usdjpy$V5
gbpusd.close <- gbpusd$V5
eurgbp.close <- eurgbp$V5
eurjpy.close <- eurjpy$V5
usdcad.close <- usdcad$V5
audusd.close <- audusd$V5
gbpjpy.close <- gbpjpy$V5

eurusd.rets <- (exp(diff(log(eurusd.close))) - 1) * 100
usdjpy.rets <- (exp(diff(log(usdjpy.close))) - 1) * 100
gbpusd.rets <- (exp(diff(log(gbpusd.close))) - 1) * 100
eurgbp.rets <- (exp(diff(log(eurgbp.close))) - 1) * 100
eurjpy.rets <- (exp(diff(log(eurjpy.close))) - 1) * 100
usdcad.rets <- (exp(diff(log(usdcad.close))) - 1) * 100
audusd.rets <- (exp(diff(log(audusd.close))) - 1) * 100
gbpjpy.rets <- (exp(diff(log(gbpjpy.close))) - 1) * 100

eurusd.var <- var(eurusd.rets)

usdjpy.beta <- cov(usdjpy.rets, eurusd.rets) / eurusd.var
gbpusd.beta <- cov(gbpusd.rets, eurusd.rets) / eurusd.var
eurgbp.beta <- cov(eurgbp.rets, eurusd.rets) / eurusd.var
eurjpy.beta <- cov(eurjpy.rets, eurusd.rets) / eurusd.var
usdcad.beta <- cov(usdcad.rets, eurusd.rets) / eurusd.var
audusd.beta <- cov(audusd.rets, eurusd.rets) / eurusd.var
gbpjpy.beta <- cov(gbpjpy.rets, eurusd.rets) / eurusd.var

usdjpy.rsquared <- cor(eurusd.rets, usdjpy.rets) ** 2
gbpusd.rsquared <- cor(eurusd.rets, gbpusd.rets) ** 2
eurgbp.rsquared <- cor(eurusd.rets, eurgbp.rets) ** 2
eurjpy.rsquared <- cor(eurusd.rets, eurjpy.rets) ** 2
usdcad.rsquared <- cor(eurusd.rets, usdcad.rets) ** 2
audusd.rsquared <- cor(eurusd.rets, audusd.rets) ** 2
gbpjpy.rsquared <- cor(eurusd.rets, gbpjpy.rets) ** 2

df <- data.frame(
    c(
        usdjpy.beta,
        gbpusd.beta,
        eurgbp.beta,
        eurjpy.beta,
        usdcad.beta,
        audusd.beta,
        gbpjpy.beta
    ),
    c(
        usdjpy.rsquared,
        gbpusd.rsquared,
        eurgbp.rsquared,
        eurjpy.rsquared,
        usdcad.rsquared,
        audusd.rsquared,
        gbpjpy.rsquared
    )
)

rownames(df) <- c(
    "USD_JPY",
    "GBP_USD",
    "EUR_GBP",
    "EUR_JPY",
    "USD_CAD",
    "AUD_USD",
    "GBP_JPY"
)

colnames(df) <- c("beta", "rsquared");

df[order(-df[, "beta"]), ]
