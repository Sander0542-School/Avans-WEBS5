const createError = require('http-errors')

module.exports = class Forwarder {
  constructor (router, breaker, passport) {
    this.router = router
    this.breaker = breaker
    this.passport = passport.authenticate('jwt', { session: false })
  }

  _handler (method, url, body, handler) {
    handler = handler || (() => undefined)
    return async (req, res, next) => {
      try {
        const result = await this.breaker.fire(method || req.method, url || req.url, req.user, body || req.body)
        handler(res, result) || res.status(result.status).send(result.data)
      } catch (error) {
        next(createError(500, error.message))
      }
    }
  }

  get (path, forwardPath, forwardMethod, forwardBody, responseHandler) {
    this.router.get(path, this.passport, this._handler(forwardMethod, forwardPath, forwardBody, responseHandler))
  }

  post (path, forwardPath, forwardMethod, forwardBody, responseHandler) {
    this.router.post(path, this.passport, this._handler(forwardMethod, forwardPath, forwardBody, responseHandler))
  }

  put (path, forwardPath, forwardMethod, forwardBody, responseHandler) {
    this.router.put(path, this.passport, this._handler(forwardMethod, forwardPath, forwardBody, responseHandler))
  }

  patch (path, forwardPath, forwardMethod, forwardBody, responseHandler) {
    this.router.patch(path, this.passport, this._handler(forwardMethod, forwardPath, forwardBody, responseHandler))
  }

  delete (path, forwardPath, forwardMethod, forwardBody, responseHandler) {
    this.router.delete(path, this.passport, this._handler(forwardMethod, forwardPath, forwardBody, responseHandler))
  }
}
