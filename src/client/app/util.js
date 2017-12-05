import hyperHTML from "hyperHTML";

export class Util {
    static query(selector) {
        return document.querySelector(selector) ||
            console.error(selector, "not found");
    }

    static handleEvent(context, e, payload) {
        const type = e.type;
        const id = e.target.id || console.warn(e.target, "target without id");
        const method = `on${id[0].toUpperCase()}${id.split("-")[0].slice(1)}` +
            `${type[0].toUpperCase()}${type.slice(1)}`;


        return method in context ? context[method](e, payload)
            : console.warn(method, "not implemented");
    }

    static renderEmpty(render) {
        return render``;
    }

    static getHHMMSSfromDate(date) {
        if (!date) {
            return "";
        }

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    }

    static formatDate(date) {
        if (!date || !date.toString()) {
            return "";
        }

        return (new Date(date)).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    static formatNumber(num, decimals = 0) {
        if (!num || !num.toString()) {
            return "";
        }

        return parseFloat(num).toFixed(decimals);
    }

    static fetch(url, options) {
        options.headers = options.headers ||
            { "Content-Type": "application/json" };

        options.body = typeof options.body === "string" ? options.body
            : JSON.stringify(options.body);

        const fetchCall = fetch(url, options);

        Util.spinnerState.isLoadingView = true;
        fetchCall.then(() => {
            Util.spinnerState.isLoadingView = false;
        }).catch(() => {
            Util.spinnerState.isLoadingView = false;
        });

        return fetchCall;
    }

    static show(condition) {
        return condition ? "display: block;" : "display: none;";
    }

    static hide(condition) {
        return Util.show(!condition);
    }
}

Util.spinnerState = {};

export class Hyper extends HTMLElement {
    connectedCallback() {
        if ("hyper" in this) {
            return;
        }
        this.hyper = hyperHTML.wire();
        this.appendChild(this.render().childNodes[0]);
    }

    render() {
        return this.hyper`render method is not implemented`;
    }
}
