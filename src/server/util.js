"use strict";

exports.log = log;

function log(...args) {
    console.log(new Date(), ...args); /* eslint no-console:off */
}
