'use strict'

var resolve = require('path').resolve
var config = require('cosmiconfig')
var assign = Object.assign

/**
 * Autoload Config for specific module name.
 *
 * @param {String} moduleName You module name. This is used to create the default
 * filenames that cosmiconfig will look for.
 *
 * @author Allex Wang (@allex_wang) <allex.wxn@gmail.com>
 * @license MIT
 */
module.exports = function(moduleName) {
  if (!moduleName) {
    throw new Error('module name required')
  }

  return function (ctx, path, options) {
    ctx = assign({ cwd: process.cwd(), env: process.env.NODE_ENV }, ctx)

    path = path ? resolve(path) : process.cwd()

    if (!ctx.env) process.env.NODE_ENV = 'development'

    var file

    return config(moduleName, options)
      .load(path)
      .then(function (result) {
        if (!result) throw Error('No FSS Config found in: ' + path)
        file = result ? result.filepath : ''
        return result ? result.config : {}
      })
      .then(function (config) {
        if (typeof config === 'function') config = config(ctx)
        else config = assign(config, ctx)
        return {
          file: file,
          options: config
        }
      })
  }
}
