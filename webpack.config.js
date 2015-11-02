var webpack = require("webpack");

module.exports = {
    entry: "./static/js/entry.js",
    output: {
        filename: "./static/js/build/bundle.min.js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: false,
            mangle: false
        }),
        new webpack.ProvidePlugin({
            "_": "underscore"
        }),
        new webpack.ProvidePlugin({
            "Backbone": "backbone"
        })
    ],
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
        {
            test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
            exclude: /node_modules/,  // excluding external libraries from your loader test.
            loader: 'babel' // The module to load. "babel" is short for "babel-loader"
        }
        ]
    }
};