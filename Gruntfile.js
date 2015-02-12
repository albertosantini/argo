"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            options: {
                config: ".eslintrc"
            },
            src: [
                "Gruntfile.js",
                "server.js",
                "lib/**/*.js",
                "app/**/*.js"
            ]
        },

        vows: {
            all: {
                src: "test/*.js",
                options: {
                    reporter: "spec",
                    error: false
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-vows-runner");

    grunt.registerTask("default", [
        "eslint"
    ]);
};
