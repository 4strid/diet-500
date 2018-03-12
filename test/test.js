const test = require('tape')
const server = require('diet')
const request = require('request-promise-native')
const error500 = require('../')

function Test (port, methodName) {
	return function (t) {
		const hostname = 'http://localhost:' + port
		const app = server()
		app.listen(hostname)
		if (!methodName) {
			app.header(error500)
		} else {
			app.header(error500.methodName(methodName))
		}

		app.get('/', function ($) {
			Promise.reject(new Error('Time to die!')).catch(err => {
				if (!methodName) {
					$.err(err)
				} else {
					$[methodName](err)
				}
			})
		})

		app.get('/ok', function ($) {
			$.end('Response')
		})

		request(hostname).then(() => {
			t.fail('Received a response where an error was expected')
		}).catch(err => {
			t.equal(err.statusCode, 500, 'Route responded with a 500 Internal Server Error')
		}).then(() => {
			return request(hostname + '/ok')
		}).then(res => {
			t.equal(res, 'Response', 'Server continues to function ok')
			t.end()
		}).catch(err => {
			t.error(err)
			t.end()
		})
	}
}

test('Should respond with a 500 server error if $.err is called', Test('7777'))

test('Should respond with a 500 server error if $[methodName] is called', Test('8888', 'serverError'))

test.onFinish(function () {
	process.exit(0)
})
