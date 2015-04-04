"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            options: {
                config: ".eslintrc"
            },
            src: [
                "Gruntfile.js",
                "karma.conf.js",
                "labs/**/*.js",
                "src/**/*.js"
            ]
        },

        karma: {
            unit: {
                configFile: "karma.conf.js"
            },

            continuos: {
                configFile: "karma.conf.js",
                singleRun: true
            }
        }

    });

    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-karma");

    grunt.registerTask("default", [
        "eslint",
        "karma:continuos"
    ]);
};
