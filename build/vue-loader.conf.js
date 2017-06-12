var utils = require('./utils')
var config = require('./config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  postcss: utils.postcssLoader().options.plugins(),
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  })
}
