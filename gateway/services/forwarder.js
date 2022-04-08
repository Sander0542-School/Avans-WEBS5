const createError = require('http-errors')

module.exports = class Forwarder {
  constructor (router, breaker, passport) {
    this.router = router
    this.breaker = breaker
    this.passport = passport.authenticate('jwt', { session: false })
  }

  _handler (method, url, body) {
    return (req, res, next) => {
      this.breaker.fire(method || req.method, url || req.url, req.user.id, body || req.body)
        .then(response => res.status(response.status).json(response.data))
        .catch(error => next(createError(500, error.message)))
    }
  }

  get (path, forwardPath, forwardMethod, forwardBody) {
    this.router.get(path, this.passport, this._handler(forwardMethod, forwardPath, forwardBody))
  }

  post (path, forwardPath, forwardMethod, forwardBody) {
    this.router.post(path, this.passport, this._handler(forwardMethod, forwardPath, forwardBody))
  }

  put (path, forwardPath, forwardMethod, forwardBody) {
    this.router.put(path, this.passport, this._handler(forwardMethod, forwardPath, forwardBody))
  }

  patch (path, forwardPath, forwardMethod, forwardBody) {
    this.router.patch(path, this.passport, this._handler(forwardMethod, forwardPath, forwardBody))
  }

  delete (path, forwardPath, forwardMethod, forwardBody) {
    this.router.delete(path, this.passport, this._handler(forwardMethod, forwardPath, forwardBody))
  }
}
