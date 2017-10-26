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

  return (ctx, path, options) => {
    ctx = assign({ cwd: process.cwd(), env: process.env.NODE_ENV }, ctx)

    path = path ? resolve(path) : process.cwd()

    if (!ctx.env) process.env.NODE_ENV = 'development'

    return config(moduleName, options)
      .load(path)
      .then(result => {
        if (!result) throw Error('No config found in: ' + path)
        var filepath = result.filepath || ''
        var config = result.config || {}
        return { filepath, config }
      })
      .then(({ filepath, config }) => {
        var mixins
        // evaluate if a function module
        if (typeof config === 'function') config = config(ctx)
        else config = assign(config, ctx)
        if ((mixins = config.extends || []).length) {
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
      })
  }
}
