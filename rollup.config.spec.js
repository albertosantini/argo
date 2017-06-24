"use strict";

module.exports = {
    input: "./src/client/app/root.module.spec.js",
    output: {
        file: "./build/app.bundle.spec.js",
        format: "iife",
        name: "test"
    },
    external: [
        "angular",
        "d3",
        "techan",
        "hyperHTML",
        "introspected",
        "mocha",
        "chai"
    ],
    globals: {
        angular: "angular",
        d3: "d3",
        techan: "techan",
        hyperHTML: "hyperHTML",
        introspected: "Introspected",
        mocha: "mocha",
        chai: "chai"
    }
};
