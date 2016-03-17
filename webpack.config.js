var webpack = require("webpack");

module.exports = {
    entry: "./app_name/static/js/entry.js",
    output: {
        filename: "./app_name/static/js/build/bundle.min.js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: false,
            mangle: false
        }),
        new webpack.ProvidePlugin({
            "_": "underscore",
            "Backbone": "backbone"
        })
    ],
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'jshint-loader'
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};