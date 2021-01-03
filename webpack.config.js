const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

module.exports = {
    mode: "production",
    entry: "./index.js",
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
        // new BundleAnalyzerPlugin(),
    ],
};
