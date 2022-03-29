const createError = require('http-errors')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

function initialize (apiKey) {
  const passport = require('common/middlewares/apikey')

  const strategy = new JwtStrategy(options, (payload, done) => {
    if (payload.token && payload.token === apiKey) {
      return done(null, {})
    }
    return done(null, false)
  })
  passport.use(strategy)

  return [
    passport.initialize(),
    function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next(createError(401))
      }
    }
  ]
}

module.exports = initialize
