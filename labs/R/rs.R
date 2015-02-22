## https://stat.ethz.ch/pipermail/r-help/2001-June/013425.html
##
## rs.test calculates the statistic of the modified R/S test
##
## x: time series
## q: number of lags included for calculation of covariances
##
## significance level: 0.05,     0.1
## critical value:     1.747,    1.62
##
## References: Lo (1991), Long-term Memory in Stock Market Prices, Econometrica 59, 1279--1313
##
rs.test <- function(x, q) {
    xbar <- mean(x)
    N <- length(x)
    r <- max(cumsum(x-xbar)) - min(cumsum(x-xbar))
    kovarianzen <- NULL
    for (i in 1:q) {
        kovarianzen <- c(kovarianzen, sum((x[1:(N-i)]-xbar)*(x[(1+i):N]-xbar)))
    }
    if (q > 0) {
        s <- sum((x-xbar)^2)/N + sum((1-(1:q)/(q+1))*kovarianzen)*2/N
    } else {
        s <- sum((x-xbar)^2)/N
    }

    rs <- r/(sqrt(s)*sqrt(N))
    method <- "R/S Test for Long Memory"
    names(rs) <- "R/S Statistic"
    names(q) <- "Bandwidth q"
    list(
        statistic = rs,
        parameter = q,
        method = method,
        data.name = deparse(substitute(x)),
    )
}
