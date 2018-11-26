const ExtractTextPlugin = require('extract-text-webpack-plugin')
const flexBugsFixes = require('postcss-flexbugs-fixes')
const EslintFriendlyFormatter = require('eslint-friendly-formatter')
const px2rem = require('postcss-px2rem')
const autoprefixer = require('autoprefixer')
const { resolve } = require('./utils')

const remUnit = 37.5
const isProduction = process.env.NODE_ENV === 'production'

let cssLoader = [
    'style-loader',
    {
        loader: 'css-loader',
        options: { sourceMap: !isProduction }
    },
    {
        loader: 'postcss-loader',
        options: {
            plugins: () => [
                flexBugsFixes(),
                px2rem({
                    remUnit
                }),
                autoprefixer({
                    browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9' // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009'
                })
            ]
        }
    },
    {
        loader: 'sass-loader',
        options: { sourceMap: !isProduction }
    },
    {
        loader: 'style-resources-loader',
        options: {
            patterns: [
                resolve('src/styles/variables/*.scss'),
                resolve('src/styles/mixins/*.scss')
            ]
        }
    }
]

if (isProduction) {
    const styleLoader = cssLoader.shift()
    cssLoader = ExtractTextPlugin.extract({
        fallback: styleLoader,
        use: cssLoader
    })
}

module.exports = {
    devtool: isProduction ? false : '#cheap-module-eval-source-map',
    output: {
        filename: '[name].[hash:9].js',
        publicPath: isProduction ? './' : ''
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.(vue|js)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    fix: true,
                    formatter: EslintFriendlyFormatter
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.html$/,
                enforce: 'post',
                oneOf: [
                    {
                        resourceQuery: /^\?vue/,
                        loader: 'vue-style-px2rem-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'images/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(css|scss)$/,
                use: cssLoader
            }
        ]
    }
}
