"use strict";

module.exports = {
    input: "./src/client/app/root.module.js",
    output: {
        file: "./build/app.bundle.js",
        format: "iife",
        name: "app",
        globals: {
            d3: "d3",
            techan: "techan",
            hyperHTML: "hyperHTML",
            introspected: "Introspected"
        }
    },
    external: [
        "d3",
        "techan",
        "hyperHTML",
        "introspected"
    ]
};
