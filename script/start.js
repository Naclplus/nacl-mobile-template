process.env.NODE_ENV = 'development'

const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.dev')
const dotenv = require('dotenv')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const opn = require('opn')

dotenv.config()
const port = process.env.PORT || 3000

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    logLevel: 'silent',
})

const hotMiddleware = webpackHotMiddleware(compiler, {
    log: false,
})

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

let _resolve
const readyPromise = new Promise(resolve => {
    _resolve = resolve
})

const uri = 'http://localhost:' + port
console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
    opn(uri)
    _resolve()
})

const server = app.listen(port)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}
