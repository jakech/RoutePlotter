const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
    devtool: 'inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            GOOGLE_MAPS_API_URL: JSON.stringify(
                '//maps.googleapis.com/maps/api/js'
            ),
            GOOGLE_MAPS_API_KEY: JSON.stringify(
                'AIzaSyDkxxOcQmYJY3M4xDy-OuVUZ7p5PXDWpMY'
            ),
            SERVICE_URL: JSON.stringify('http://localhost:8080')
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        port: 3000
    }
})
