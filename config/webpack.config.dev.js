const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = merge(baseConfig, {
    mode: 'development',
    entry: ['./src/index.js', 'webpack-hot-middleware/client?noInfo=true&reload=true'],
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin(),
        new VueLoaderPlugin()
    ]
})
