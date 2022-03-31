const createError = require('http-errors')

module.exports = class Forwarder {
  constructor (router, breaker, passport) {
    this.router = router
    this.breaker = breaker
    this.passport = passport.authenticate('jwt', { session: false })
  }

  _handler (forwardMethod, forwardPath) {
    return (req, res, next) => {
      this.breaker.fire(forwardMethod, forwardPath, req.user.id, req.body)
        .then(value => res.json(value))
        .catch(reason => next(createError(500, reason.message)))
    }
  }

  get (path, forwardMethod, forwardPath) {
    this.router.get(path, this.passport, this._handler(forwardMethod, forwardPath))
  }

  post (path, forwardMethod, forwardPath) {
    this.router.post(path, this.passport, this._handler(forwardMethod, forwardPath))
  }
}
