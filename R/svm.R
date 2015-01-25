require(kernlab)

x <- read.csv("../dump/2015-01-22-EUR-USD-M5.csv", header = FALSE)
names(x) <- c("datetime", "open", "high", "low", "close", "volume")

pip <- 0.0001

x.train <- x[1:400, ]
x.test <- x[401:500, ]
x.n <- NROW(x.test)

fit <- ksvm(close ~ open + high + low + volume, data = x.train,
    type = "nu-svr", kernel = "vanilladot")
fit

forecast <- as.numeric(predict(fit, x.test))

plot(x.test$close, type = "l")
lines(forecast, col = "red")

mse <- sum(((forecast - x.test$close) / pip) ^ 2) / x.n
mse

diff1 <- round((x.test$open - forecast) / pip, 2)
diff2 <- (x.test$open - x.test$close) / pip
table(diff1 > 0, diff2 > 0)

tail(x.test, 1)
tail(forecast, 1)
