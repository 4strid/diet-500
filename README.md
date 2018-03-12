# diet-500
Emergency Exits for Diet.js

If you're trying to use Promises in Diet you may have noticed that you can't just throw an
error to trigger a 500 Sever Error, since it ends up swallowed by the Promise chain. As far as
I can tell, there's no way to directly call the error route in Diet.js.

This module provides middleware to add a method to the signal object ($) to throw an error
out of a Promise chain.

Installation
------------
```
npm install --save diet-500
```
Note that in modern versions of NPM (>= 5) you don't actually need the `--save` flag.

Usage
-----
```javascript
const server      = require('diet')
const serverError = require('diet-500')

app = server()

app.listen('http://localhost:8888')

app.header(serverError)

app.get('/', function ($) {
	return Promise.resolve().then(() => {
		throw new Error('Time to die!')
	}).catch(err => {
		$.err(err)
	})
})
```

By default, the method attached to the signal is `err`. You can specify a different method name
if you like.

```javascript
const server      = require('diet')
const serverError = require('diet-500').methodName('error500')

app = server()

app.listen('http://localhost:9999')

app.header(serverError)

app.get('/', function ($) {
	return Promise.reject(new Error('GOING DOWN'))
	.catch(err => {
		$.error500(err)
	})
})
```
