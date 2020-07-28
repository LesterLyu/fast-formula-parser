const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: "production",
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "./build/"),
        filename: "parser.min.js",
        library: "FormulaParser",
        libraryTarget: "umd",
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
    ],
};
