# connie

Configuration loader for use with or without [app-context](https://github.com/mattinsler/app-context). connie uses a pluggable storage engine that can be changed and extended.

**connie** uses [connie-lang](https://github.com/mattinsler/connie-lang) to interpret configuration objects after they are read from the storage.

## Installation

```bash
$ npm install --save connie
```

## Usage

#### Using a single storage engine

```javascript
var connie = require('connie');
var configurer = connie('file', 'config.json');

configurer.read().then(function(config) {
  console.log(config);
});

configurer.write({foo: 'bar'}).then(function() {
  console.log('Config written');
});
```

#### Merging multiple storage engines

```javascript
var connie = require('connie');
var configurer = connie.combine()
  .merge('file', 'config/default.json')
  .merge('dir', 'config/production')
  // if a file does not exist, the file storage engine will return an empty object
  // so you can have a default local config override that will only load when it's present
  .merge('file', '/users/mattinsler/localconfig.json');

configurer.read().then(function(config) {
  console.log(config);
});
```

## Built-in storage engines

#### file

Loads config from a JSON file.

```javascript
var configurer = connie('file', 'path/to/file.json');
```

#### dir

Loads config from a directory of JSON files.

```javascript
var configurer = connie('dir', 'path/to/dir');
```

File names will become keys in your config. For example, if you had a directory
`config` with files `facebook.json` and `twitter.json`, each with something that looks
like the following

```json
{
  "key": "...",
  "secret": "..."
}
```

then the resulting config would be

```json
{
  "facebook": {
    "key": "...",
    "secret": "..."
  },
  "twitter": {
    "key": "...",
    "secret": "..."
  }
}
```

#### env

Loads config from an environment variable. The format of the environment variable is a
semi-colon separated list of key-value pairs.

```javascript
// load from CONFIG_OVERRIDE environment variable
var configurer = connie('env');

// load from CONFIG environment variable
var configurer = connie('env', 'CONFIG');
```

For example, if you set the environment variable to `foo=bar;baz.foo=3` then the
resulting config object would be

```json
{
  "foo": "bar",
  "baz": {
    "foo": "3"
  }
}
```

## Usage with [app-context](https://github.com/mattinsler/app-context)

```javascript
var connie = require('connie');
var AppContext = require('app-context');

AppContext.createContext({
  configure: function() {
    this.use(AppContext.RunLevel.Configured,
      connie('file', 'config.json').initializer()
    );
  }
});
```

## Creating a custom storage engine

Storage engines are simple objects that expose a `read` and `write` method. These can be
asynchronous by returning a promise.

Storage engines are stored on the `connie.storage` object. To add a new one, just add a
method to the storage object that returns the `read`/`write` object.

For examples, take a look at the built-in implementations.

```javascript
var connie = require('connie');

connie.storage.custom = function() {
  return {
    read: function() {
      // return configuration object
      // can return a promise
    },
    write: function(config) {
    }
  };
};
```
