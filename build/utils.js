var path = require('path')
var config = require('./config')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const promisify = require('es6-promisify');
const glob = promisify(require('glob'))

exports.isVendor = function(module) {
  module.resource &&
  /\.js$/.test(module.resource) &&
  module.resource.indexOf(
    path.join(__dirname, '../node_modules')
  ) === 0
}

exports.getEntries = async function () {
  const files = await glob(config.base.entryPath)
  const entry = {}
  files.forEach(file => {
      const entryName = path.posix.relative(config.base.entryRoot, file).replace(/\.js/, '')
      entry[entryName] = [file]
  })
  if(process.env.NODE_ENV === 'development') {
    const webpackDevServerPath = `webpack-dev-server/client?http://localhost:${config.dev.port}/`;
    for(let chunkName in entry) {
      entry[chunkName].unshift(`webpack-dev-server/client?http://localhost:${config.dev.port}/`, 'webpack/hot/dev-server');
    }
  }
  return entry;
}

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

console.log(1111, path.join(__dirname, '../fesrc'))

exports.postcssLoader = function() {
  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      config: {
        path: 'build/postcss.config.js',
      },
      // 也可用于vue-loader中配置postcss
      plugins: (loader) => {
        var plugins =  [
          require('postcss-cssnext')()
        ]
        return plugins
      },
    }
  }
  return postcssLoader
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  var postcssLoader = exports.postcssLoader(options)


  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader, postcssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
