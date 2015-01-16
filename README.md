# connie

Configuration loader for use with or without [app-context](https://github.com/mattinsler/app-context). connie uses a pluggable storage engine that can be changed and extended.

**connie** uses [connie-lang](https://github.com/mattinsler/connie-lang) to interpret configuration objects after they are read from the storage.

## Installation

```bash
$ npm install --save connie
```

## Usage

```javascript
var connie = require('connie')('file', 'config.json');

connie.read().then(function(config) {
  console.log(config);
});

connie.write({foo: 'bar'}).then(function() {
  console.log('Config written');
});
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
