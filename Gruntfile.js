"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            options: {
                config: ".eslintrc"
            },
            src: [
                "Gruntfile.js",
                "labs/**/*.js",
                "src/**/*.js"
            ]
        }

    });

    grunt.loadNpmTasks("grunt-eslint");

    grunt.registerTask("default", [
        "eslint"
    ]);
};
