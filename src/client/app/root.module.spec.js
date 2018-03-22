import "./components/components.module.spec.js";

(function(self) {
    const responses = {};

    function mockResponse(
        body = {},
        headers = { "Content-type": "application/json" }
    ) {
        return Promise.resolve(new Response(JSON.stringify(body), {
            status: 200,
            headers: new Headers(headers)
        }));
    }

    self.fetch = url => {
        if (url in responses) {
            return mockResponse(responses[url.toString()]);
        }

        return mockResponse();
    };

    self.fetch.mock = (api, data) => {
        responses[api] = data;
    };
}(typeof self !== "undefined" ? self : window));
