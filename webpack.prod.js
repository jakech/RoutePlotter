const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            GOOGLE_MAPS_API_URL: JSON.stringify(
                '//maps.googleapis.com/maps/api/js'
            ),
            GOOGLE_MAPS_API_KEY: JSON.stringify(
                'AIzaSyDkxxOcQmYJY3M4xDy-OuVUZ7p5PXDWpMY'
            )
        }),
        new UglifyJsPlugin({
            sourceMap: true
        })
    ]
})
