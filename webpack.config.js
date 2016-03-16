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
            "_": "underscore"
        }),
        new webpack.ProvidePlugin({
            "Backbone": "backbone"
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
                exclude: /node_modules/,  // excluding external libraries from your loader test.
                loader: 'babel' // The module to load. "babel" is short for "babel-loader"
            }
        ]
    }
};