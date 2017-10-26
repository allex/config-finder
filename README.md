# config-finder

Find and load a configuration object. based on [cosmiconfig][1]

## Installation

```sh
npm i config-finder
```

## Features

- Support functionaly evaluation with customize context.
- Mixin multiple externals by `extends` property.

## Usage

```js
// cat package.json
{
  ...

  "fss": {
    "extends": [
      "./.fssrc.js"
    ],
    "foo": [ "bar" ]
  }
}

// cat ./.fssrc.js
module.exports = (ctx) => {
  return Object.assign({}, ctx,
    {
      rollup: { /* input, output */ }
    }
}
```

```js
const configFinder = require('config-finder')
const yourModuleName = 'fss'
const modConfig = configFinder(yourModuleName)
 
const cfg = modConfig(ctx[, path, options])
  .then((result) => {
    // result.config is the parsed configuration object
    // result.filepath is the path to the config file that was found
  })
  .catch((parsingError) => {
    // do something constructive
  });
```

## License

[MIT](http://opensource.org/licenses/MIT)

[1]: https://www.npmjs.com/package/cosmiconfig
