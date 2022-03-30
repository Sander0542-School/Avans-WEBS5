const jwt = require('jsonwebtoken')

module.exports = {
  sign: function (payload, options) {
    return jwt.sign(payload, process.env.JWT_SECRET, options)
  }
}
