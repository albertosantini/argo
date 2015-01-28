//------------------------------------------------------------------------------
//
// Support Vector Machine analysis
//
//------------------------------------------------------------------------------
"use strict";

var fs = require("fs"),
    svm = require("node-svm");

fs.readFile("../dump/dump.csv", function (err, data) {
    if (err) {
        return;
    }

    processFile(data.toString());
});

function processFile(data) {
    var lines = data.split("\n").slice(0, -1),
        samples = [];

    lines.forEach(function (line) {
        var fields = line.split(","),
            open = parseFloat(fields[1]),
            high = parseFloat(fields[2]),
            low = parseFloat(fields[3]),
            close = parseFloat(fields[4]),
            input = [open, high, low],
            output = close,
            sample = [input, output];

        samples.push(sample);
    });

    runSVM(samples);
}

function runSVM(samples) {
    var trainSamples = samples.slice(0, 400),
        testSamples = samples.slice(400, 500),
        fit = new svm.NuSVR({
            kernelType: "LINEAR",
            reduce: false,
            c: 1,
            nu: 0.2,
            epsilon: 0.1,
            gamma: 0.3333333,
            kFold: 1
        });

    fit
        .train(trainSamples)
        .spread(function () {
            var n = testSamples.length - 1,
                lastInputs = testSamples[n][0],
                lastOutput = testSamples[n][1],
                forecast = fit.predictSync(lastInputs);

            // console.log(model, report);
            console.log(lastInputs, lastOutput, forecast);
    });
}
