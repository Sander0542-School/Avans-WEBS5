const CircuitBreaker = require('../services/circuitBreaker')
const express = require('express')
const Forwarder = require('../services/forwarder')

function initialize (passport) {
  const router = express.Router()
  const breaker = CircuitBreaker(process.env.SUBMISSION_HOST || 'submission', process.env.SUBMISSION_PORT || 3000, process.env.SUBMISSION_API_KEY)
  const forwarder = new Forwarder(router, breaker, passport)

  forwarder.post('/targets/:id/submissions')

  return router
}

module.exports = initialize
