const CircuitBreaker = require('../services/circuitBreaker')
const express = require('express')
const Forwarder = require('../services/forwarder')
const parseDataUrl = require('parse-data-url')

function handleImage (res, axios) {
  if (axios.status === 200) {
    const parsed = parseDataUrl(axios.data)
    if (parsed) {
      res.set('Content-Type', parsed.contentType || 'image/png')
      return res.send(parsed.toBuffer())
    }
  }
}

function initialize (passport) {
  const router = express.Router()
  const breaker = CircuitBreaker(process.env.CQRS_HOST || 'cqrs', process.env.CQRS_PORT || 3000, process.env.CQRS_API_KEY)
  const forwarder = new Forwarder(router, breaker, passport)

  forwarder.get('/targets')
  forwarder.get('/targets/:id')
  forwarder.get('/targets/:id/ratings')
  forwarder.get('/targets/:id/image', undefined, undefined, undefined, handleImage)
  forwarder.get('/targets/:id/submissions')
  forwarder.get('/targets/:id/submissions/:submissionId')
  forwarder.get('/targets/:id/submissions/:submissionId/image', undefined, undefined, undefined, handleImage)

  return router
}

module.exports = initialize
