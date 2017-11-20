'use strict'

const p = require('path')
const config = require('cosmiconfig')
const resolve = p.resolve
const assign = Object.assign

/**
 * Autoload config for specific module name, evaluate the generator if a function
 * module, and try to merge the mixins if `extends` provided.
 *
 * @param {String} moduleName You module name. This is used to create the default
 * filenames that cosmiconfig will look for.
 *
 * @author Allex Wang (@allex_wang) <allex.wxn@gmail.com>
 * @license MIT
 */

module.exports = (moduleName) => {
  if (!moduleName) {
    throw new Error('module name required')
  }

  // ctx, path, options
  const explorer = (...args) => {
    let [ ctx, path, options ] = args
    path = path ? resolve(path) : process.cwd()

    if ((options || 0).sync) {
      return explorer.sync(...args)
    }

    return loadConfig(...[moduleName, ...args])
      .then(result => {
        if (!result) throw Error('No config found in: ' + path)

        var filepath = result.filepath || ''
        var config = result.config || {}
        return { filepath, config }
      })
      .then(result => normalizeResult({ ctx, ...result }))
  }

  explorer.sync = (ctx, path, options = {}) => {
    options = assign({}, options, { sync: true })
    path = path ? resolve(path) : process.cwd()

    const result = loadConfig(...[ moduleName, ctx, path, options ])
    if (!result) throw Error('No config found in: ' + path)

    var filepath = result.filepath || ''
    var config = result.config || {}

    return normalizeResult({ filepath, config, ctx })
  }

  return explorer
}

function loadConfig (moduleName, ctx, path, options) {
  ctx = assign({ cwd: process.cwd(), env: process.env.NODE_ENV }, ctx)

  if (!ctx.env) process.env.NODE_ENV = 'development'

  return config(moduleName, options)
    .load(path)
}

function normalizeResult ({ filepath, config, ctx }) {
  // evaluate if a function module
  if (typeof config === 'function') config = config(ctx)
  else config = assign(config, ctx)

  var mixins = config.extends
  mixins = mixins ? (Array.isArray(mixins) ? mixins : [ mixins ]) : []
  if (mixins.length) {
    var relative = p.dirname(filepath)
    mixins = mixins.map(module => {
      var m
      try {
        m = require(module)
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
          module = p.resolve(relative, module)
          m = require(module)
        }
      }
      return m
    })
  }

  config = assign.apply(Object, [ {}, ...mixins, config ])

  return { filepath, config }
}
