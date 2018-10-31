[![License][license-img]][license-url]

### crypto-session

* Use [koa-session](https://github.com/koajs/session), but encrypted.

### Usage

* `options` will pass to [koa-session](https://github.com/koajs/session)

```js
const session = require('crypto-session')
const app = require('koa')()

session(app, {
  crypto_key: 'exiKdyF+IwRIXJDmtGIl4vWUz4i3eVSISpfZoeYc0s4='
})
```

Generate a new crypto_key (note, the length depends on your algorithm):
```bash
$ node
> crypto.randomBytes(32).toString('base64')
```

### License
MIT

[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
