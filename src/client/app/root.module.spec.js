import "./components/components.module.spec.js";

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

window.fetch = url => {
    if (url in responses) {
        return mockResponse(responses[url.toString()]);
    }

    return mockResponse();
};

window.fetch.mock = (api, data) => {
    responses[api] = data;
};
