const CircuitBreaker = require('../services/circuitBreaker')
const express = require('express')
const Forwarder = require('../services/forwarder')

function initialize (passport) {
  const router = express.Router()
  const breaker = CircuitBreaker(process.env.CQRS_HOST || 'cqrs', process.env.CQRS_PORT || 3000, process.env.CQRS_API_KEY)
  const forwarder = new Forwarder(router, breaker, passport)

  forwarder.get('/targets')
  forwarder.get('/targets/:id')
  forwarder.get('/targets/:id/submissions')
  forwarder.get('/targets/:id/submissions/:submissionId')

  return router
}

module.exports = initialize
