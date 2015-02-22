library(tseries)
library(ecp)

x <- read.csv("../dump/dump-EUR_USD.csv", header = FALSE)
names(x) <- c("datetime", "open", "high", "low", "close", "volume")

x <- as.matrix(x$close, ncol = 1)
o <- e.divisive(x)

changePoints <- o$estimates[c(-1, -length(o$estimates))]
breaks <- diff(c(0, changePoints, length(x)))
means <- rep(tapply(x, o$cluster, mean), breaks)

ts.plot(x)
# abline(v = changePoints, col = "red", lty = 2)
lines(means, col = "red")
