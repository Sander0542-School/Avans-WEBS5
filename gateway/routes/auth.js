const express = require('express')

const router = express.Router()

router.get('/register', function (req, res) {
  res.json({
    email: 'Your email',
    password: 'Your password',
    isOwner: 'Whether you are an owner'
  })
})

router.get('/login', function (req, res) {
  res.json({
    email: 'Your email',
    password: 'Your password'
  })
})

router.post('/register', function (req, res) {

})

router.post('/login', function (req, res) {

})

module.exports = router
