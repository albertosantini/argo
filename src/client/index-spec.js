const { ipcRenderer: ipc, remote } = require("electron");
const remoteConsole = remote.require("console");

console.log = function(...args) { // eslint-disable-line no-console
    remoteConsole.log.apply(null, args);
};

mocha.run((...args) => {
    ipc.send("mocha-done", ...args);
});
