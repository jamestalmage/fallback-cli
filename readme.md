# fallback-cli [![Build Status](https://travis-ci.org/jamestalmage/fallback-cli.svg?branch=master)](https://travis-ci.org/jamestalmage/fallback-cli)

> Default to the locally installed version of your CLI, use the global one if not found.

This allows users to install your tool globally, but revert to whatever version is installed
locally in `node_modules`. `npm` already handles this when running scripts defined in `package.json`,
but this works even when invoking your CLI command directly from the console.

## Install

```
$ npm install --save fallback-cli
```

## Basic Usage

Let's assume you've created package called `my-module`, and your CLI is `bin/cli.js`.

First, create `cli-shim.js`, and place it in the *same folder* as your existing `cli.js`.

`bin/cli-shim.js`:

```js
#!/usr/bin/env node
require('fallback-cli')('my-module/bin/cli.js');
```

Next update your `package.json` to point to `cli-shim.js`.

```json
{
  "name": "my-module",
  "bin": "bin/cli-shim.js"
}
```

That's it! Now your globally installed CLI will use the locally installed version. In most
cases this will even be backwards compatible with versions before you introduced `fallback-cli`.

**Note:** `cli.js` and `cli-shim.js` are arbitrary file names, use whatever you wish.

## Advanced Usage

Instead of a conventional `cli.js`, have it export a function:

```js
var minimist = require('minimist'); // or whatever argv processor you prefer
var version = require('./package.json').version;
myCli.version = version;
module.exports = myCli;

function myCli(args) {
  var args = minimist(args);
  // do cool stuff!
}
```

Similar to above, setup your `cli-shim.js`:

```js
#!/usr/bin/env node
require('fallback-cli')({
  path: 'my-module/bin/cli.js',
  run: function (location, cli) {
    
    // only necessary if you legacy cli implementations that do not export a function.
    if (typeof cli !== 'function') {
      return; // legacy cli - already executed upon "require"
    }
    
    // run the new cli that does export a function. 
    cli(process.argv.slice(2));
  }
});
```

A couple key advantages to this approach. First, requiring `cli.js` no longer has side-effects. 
Second, you now have a nice hook for testing your cli. 

Exporting your package version is not required, but highly recommended.
It will allow you to use `semver` to modify how `cli-shim.js` runs things in the future.

```js
#!/usr/bin/env node
var shimVersion = require('./package.json').version;
var semver = require('semver');

require('fallback-cli')({
  path: 'my-module/bin/cli.js',
  run: function (location, cli) {
    if (semver.gt(cli.version, shimVersion)) {
      console.log('WARNING: your globally installed version is behind the local one, consider upgrading');
    }
    if (semver.lt(cli.version, '0.2.0') {
      console.log('versions prior to 0.2.0 have a major security vulnerability, aborting');
      process.exit(1);
    }
    cli(process.argv.slice(2));
  }
});
```

## API

### fallbackCli(path)

`path` should be a string describing your packages name, 
and the path to your CLI implementation (i.e. `my-module/bin/my-cli.js`).
        
### fallbackCli(path, relativePath)

By default, we expect the "shim" to be installed in the same directory as the actual CLI implementation. 
If that is not possible, you can use `relativePath` to describe where it is relative to the shim.

```js
fallbackCli('my-module/bin/the-cli.js', '../bin/the-cli.js');
```

### fallbackCli(options)

#### options.path

**required**

Type: `string`

Same as `path` described in `fallbackCli(path)` above.

#### options.relative

*optional*

Type: `string`

Same as `relativePath` described in `fallbackCli(path, relativePath)` above.

#### options.before

*optional*

Runs before you CLI module is `require`'d.

Type: `callback(location, cliModulePath)`

  * `location` - A string. 
                 Will be `"local"` if there is a version of your CLI installed locally in `node-modules`. 
                 Will be `"global"` if a local version is not found, and we are falling back to the global one. 
                 
  * `cliModulePath` - A string. The absolute path to the module that will be required.

`before` can optionally return a result that will be passed to the `run` callback (described below).

#### options.require

*optional*

Allows you to intercept the `require` of your cliModule.

Type: `callback(cliModulePath)`

  * `cliModulePath` - The absolute value of the path to be required.
   
Return: the result of requiring `cliModulePath`.

Defaults to using nodes built-in`require` method.

Possible uses might be invoking a preprocessor (i.e. `coffescript`).

#### options.run

*optional*

Used to execute your cli. Run after your CLI module is `require`'d.

In conventional cases, simply `require`ing you CLI module will cause it to execute. 
As described in [`Advanced Usage`](#Advanced Usage), there are reasons that is undesirable.

Type: `callback(location, cliModule, beforeResult)`

  * `location` - A string. 
                 Will be `"local"` if there is a version of your CLI installed locally in `node-modules`. 
                 Will be `"global"` if a local version is not found, and we are falling back to the global one. 
                 
  * `cliModule` - Whatever value you exported from your actual CLI implementation (probably a function).
                  If you provided a `require` callback, it will be whatever that result is.
  
  * `beforeResult` - Whatever value you returned from your `before` callback.

#### looking for `options.after`?

It doesn't exist. If you need this, use `options.run`, and pass a callback to your CLI implementation.

## Async Operation

By default, the entire process of loading your CLI and executing it happens synchronously.
However, both the `options.before`, and `options.require` can be made asynchronous.

`cli-shim.js`:

```js
#!/usr/bin/env node
require('fallback-cli')({
  path: 'my-module/cli',
  before: function () {
    var done = this.async();
    
    // do some stuff asynchronously, then...
    
    done(beforeResult);
  };
});
```

## License

MIT © [James Talmage](http://github.com/jamestalmage)
