const path = require("path");
const webpack = require('webpack');

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./build/"),
        filename: "parser.min.js",
        library: "FormulaParser",
        libraryTarget: "umd",
        globalObject: 'this'
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: 'parser.min.js.map'
        }),
    ],
};
