require('./check-versions')()

var utils = require('./utils')
var path = require('path')
var WebpackDevServer = require('webpack-dev-server')

var config = require('./config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var webpack = require('webpack')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

var port = process.env.PORT || config.dev.port
var autoOpenBrowser = !!config.dev.autoOpenBrowser
var compiler = webpack(webpackConfig)

const devServer = {
  hot: true,
  // contentBase: 'www',
  contentBase: config.dev.assetsRoot,
  proxy: {
    '*': {
      target: config.dev.proxyTarget
    }
  },
  publicPath: config.dev.assetsPublicPath
}
console.log('> Starting dev server...')
const server = new WebpackDevServer(compiler, devServer)
server.listen(config.dev.port, function (err) {
  const uri = 'http://localhost:' + config.dev.port
  opn(uri)
})
