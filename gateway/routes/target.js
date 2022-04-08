const CircuitBreaker = require('../services/circuitBreaker')
const express = require('express')
const Forwarder = require('../services/forwarder')

function initialize (passport) {
  const router = express.Router()
  const breaker = CircuitBreaker(process.env.TARGET_HOST || 'target', process.env.TARGET_PORT || 3000, process.env.TARGET_API_KEY)
  const forwarder = new Forwarder(router, breaker, passport)

  forwarder.post('/targets')
  forwarder.delete('/targets/:id')
  forwarder.put('/targets/:id/rate')

  return router
}

module.exports = initialize
