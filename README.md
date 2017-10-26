# config-finder

Find and load a configuration object. based on [cosmiconfig][1]

$ cat package.json

```json
{
  ...

  "fss": {
    "extends": [
      "./.fssrc.js"
    ],
    "foo": [ "bar" ]
  }
}
```

```js
const configFinder = require('config-finder');

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

## Installation

```sh
npm i config-finder
```

## Features

- Support functionaly module evaluation with customize context.
- Support mixin configs by `extends` property.

## Usage

```js
```

## License

[MIT](http://opensource.org/licenses/MIT)

[1]: https://www.npmjs.com/package/cosmiconfig
