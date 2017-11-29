"use strict";

module.exports = {
    input: "./src/client/app/root.module.js",
    output: {
        file: "./build/app.bundle.js",
        format: "iife",
        name: "app"
    },
    external: [
        "d3",
        "techan",
        "hyperHTML",
        "introspected"
    ],
    globals: {
        d3: "d3",
        techan: "techan",
        hyperHTML: "hyperHTML",
        introspected: "Introspected"
    }
};
