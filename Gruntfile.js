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
        },

        conventionalChangelog: {
            options: {
                changelogOpts: {
                    preset: "angular"
                }
            },
            release: {
                src: "CHANGELOG.md"
            }
        }

    });

    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-conventional-changelog");

    grunt.registerTask("default", [
        "eslint",
        "karma:continuos"
    ]);
};
