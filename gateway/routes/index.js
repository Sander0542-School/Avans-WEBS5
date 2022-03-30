const express = require('express')

function initialize (passport, roles) {
  const router = express.Router()

  router.get('/', function (req, res) {
    res.json([])
  })

  router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user)
  })

  return router
}

module.exports = initialize
