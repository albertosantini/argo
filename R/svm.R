require(kernlab)
# require(e1071)

x <- read.csv("../dump/dump-EUR_USD.csv", header = FALSE)
names(x) <- c("datetime", "open", "high", "low", "close", "volume")

pip <- 0.0001

x.train <- x[1:400, ]
x.test <- x[401:500, ]
x.n <- NROW(x.test)

fit <- ksvm(close ~ open + high + low, data = x.train, type = "nu-svr", kernel = "vanilladot")
# fit <- svm(close ~ open + high + low, data = x.train, epsilon = 0.1, nu = 0.2, type = "nu-regression", kernel = "linear")
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
