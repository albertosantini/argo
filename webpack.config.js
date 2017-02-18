"use strict";

const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/client/app/root.module.js",
        vendor: [
            "angular",
            "angular-animate",
            "angular-aria",
            "angular-material",
            "angular-material/angular-material.css",
            "d3",
            "techan"
        ]
    },

    output: {
        path: "./build",
        filename: "[name].bundle.js"
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: false,
            sourceMap: true
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
            exclude: [/vendor/, /\.css$/]
        }),
        new ExtractTextPlugin({
            filename: "[name].bundle.css"
        }),
        new webpack.ProvidePlugin({
            "window.d3": "d3"
        })
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: "css-loader?minimize"
                })
            }
        ]
    },

    performance: {
        hints: false
    }

};
