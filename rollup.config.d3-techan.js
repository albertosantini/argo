import node from "rollup-plugin-node-resolve";

export default {
    input: "rollup.index.d3-techan.js",
    output: {
        file: "build/d3-techan.js",
        format: "umd",
        name: "d3"
    },
    plugins: [node()]
};
