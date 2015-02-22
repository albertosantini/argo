# https://quantstrattrader.wordpress.com/2014/06/22/the-continuing-search-for-robust-momentum-indicators-the-fractal-adaptive-moving-average/
require(quantmod)

x <- read.zoo("../dump/2015-01-22-EUR-USD-M5.csv", sep = ",", header = FALSE,
        index.column = 1, format = "%Y-%m-%dT%H:%M:%S", FUN = as.POSIXct)
names(x) <- c("Open", "High", "Low", "Close", "Volume")

#'FRactal Adaptive Moving Average
#'@param HLC an HLC price series
#'@param n a lookback period
#'@param FC a fast constant--aka lowest n for an EMA
#'@param SC a slow constant--aka lowest n for an EMA
#'@param triggerLag a number of days by which to lag the original computation
#'@return an xts containing the FRAMA and the trigger
#'@references
#'\cr\url{http://www.mesasoftware.com/Papers/FRAMA.pdf}
#'\cr\url{http://etfhq.com/blog/2010/09/30/fractal-adaptive-moving-average-frama/}
#'@export
"FRAMA" <- function(HLC, n=20, FC=1, SC=200, triggerLag=1, ...) {
    price <- Cl(HLC)
    if (n%%2==1) n=n-1 #n must be even
    N3 <- (runMax(Hi(HLC), n)-runMin(Lo(HLC), n))/n
    N1 <- (runMax(Hi(HLC), n/2)-runMin(Lo(HLC), n/2))/(n/2)
    lagSeries <- lag(HLC, n/2)
    N2 <- (runMax(Hi(lagSeries), n/2)-runMin(Lo(lagSeries), n/2))/(n/2)
    dimen <- (log(N1+N2)-log(N3))/log(2)
    w <- log(2/(SC+1))
    oldAlpha <- exp(w*(dimen-1))
    oldN <- (2-oldAlpha)/oldAlpha
    newN <- ((SC-FC)*(oldN-1)/(SC-1))+FC
    alpha <- 2/(newN+1)
    alpha[which(alpha > 1)] <- 1
    alpha[which(alpha < w)] <- w
    alphaComplement <- 1-alpha
    initializationIndex <- index(alpha[is.na(alpha)])
    alpha[is.na(alpha)] <- 1; alphaComplement[is.na(alphaComplement)] <- 0
    FRAMA <- rep(0, length(price))
    FRAMA[1] <- price[1]
    FRAMA <- computeFRAMA(alpha, alphaComplement, FRAMA, price)
    FRAMA <- xts(FRAMA, order.by=index(price))
    FRAMA[initializationIndex] <- alpha[initializationIndex] <- NA
    trigger <- lag(FRAMA, triggerLag)
    out <- cbind(FRAMA=FRAMA, trigger=trigger)
    return(out)
}

"computeFRAMA" <- function(alpha, alphaComplement, FRAMA, price) {
    n = NROW(alpha)
    for(i in 2:n) {
        FRAMA[i] = alpha[i] * price[i] + alphaComplement[i] * FRAMA[i - 1]
    }

    FRAMA
}

frama0 <- FRAMA(x, n = 20, FC = 1, SC = 200)$FRAMA
frama1 <- FRAMA(x, n = 126, FC = 4, SC = 300)$FRAMA

plot(Cl(x[400:500]), type = "l")
lines(frama0[400:500], col = "blue")
lines(frama1[400:500], col = "green")
