# connie

Configuration loader using a pluggable storage engine and custom interpolation language.

**connie** uses [connie-lang](https://github.com/mattinsler/connie-lang) to interpret configuration objects after they are read from the storage.

**connie** works really well with [app-context](http://app-contextjs.com). Check out the simple integration using [app-context-connie](https://github.com/mattinsler/app-context-connie).

`.json` and `.txt` files will be loaded based on their extension.

## Installation

```bash
$ npm install --save connie
$ yarn add connie
```

## Usage

#### Using a single storage engine

```typescript
import * as connie from 'connie';

async function main() {
  const config = await connie('file', 'config.json').read();
  console.log(config);
}
```

## Built-in storage engines

#### file

Loads config from a file.

```typescript
connie('file', 'path/to/file.json')
connie('file', 'path/to/file.txt')
```

#### dir

Loads config from a directory of files.

```typescript
connie('dir', 'path/to/dir')
```

File names will become keys in your config. For example, if you had a directory
`config` with the following files:

#### `facebook.txt`
```
hello world!
```

#### `twitter.json`
```json
{
  "key": "...",
  "secret": "..."
}
```

then the resulting config would be

```json
{
  "facebook": "hello world!",
  "twitter": {
    "key": "...",
    "secret": "..."
  }
}
```

#### http

Loads config from a JSON endpoint using a simple GET request.

```typescript
 connie('http', 'http://your-configuration-server.com/production.json')
```

##### http options

You can also pass an options object instead of just a URL.

**`url`** (required) - URL of HTTP endpoint

**`headers`** - an object containing extra headers to add to the request

**`method`** - the method to use (defaults to GET)

**`query`** - an object to be stringified into the querystring

**`auth`** - an auth string for basic authentication

**`timeout`** - number of milliseconds before the request will timeout

```javascript
var configurer = connie('http', {
  url: 'http://your-configuration-server.com/production.json',
  method: 'POST',
  headers: {
    'User-Agent': 'foobar',
    auth: 'username:password'
  }
});
```

## Usage with [app-context](http://app-contextjs.com) through [app-context-connie](https://github.com/mattinsler/app-context-connie)

```javascript
module.exports = function() {
  this.runlevel('configured')
    .use('connie', 'file', 'config.json');
};
```
