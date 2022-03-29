const express = require('express')

function initialize (passport, roles) {
  const router = express.Router()

  router.get('/', function (req, res) {
    res.json([])
  })

  router.get('/owner', passport.authenticate('jwt', { session: false }), roles.can('owner'), (req, res) => {
    res.json(req.user)
  })

  return router
}

module.exports = initialize
