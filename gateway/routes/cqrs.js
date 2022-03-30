const express = require('express')
const CircuitBreaker = require('../services/circuitBreaker')

function initialize (passport) {
  const router = express.Router()
  const breaker = CircuitBreaker(process.env.CQRS_HOST || 'localhost', process.env.CQRS_PORT || 3000, process.env.CQRS_API_KEY)

  router.get('/targets', passport.authenticate('jwt', { session: false }), (req, res) => {
    breaker.fire('get', 'targets', req.user.id, {})
      .then(res.json)
      .catch(res.json)
  })

  return router
}

module.exports = initialize
