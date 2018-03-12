function Middleware (name) {
	return function ($) {
		$[name] = function (error) {
			setImmediate(() => { throw error })
		}
		$.return()
	}
}

const middleware = Middleware('error')

middleware.methodName = function (name) {
	return Middleware(name)
}

module.exports = middleware
