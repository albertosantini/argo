"use strict";

module.exports = stream;

function stream(ws, event) {
    console.log(event.type, event.data);
    ws.send(event.data);
}
