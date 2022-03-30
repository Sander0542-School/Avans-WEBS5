const createError = require('http-errors')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

function initialize (apiKey) {
  const passport = require('passport')
  const strategy = new JwtStrategy(options, (payload, done) => {
    if (payload.token && payload.token === apiKey) {
      return done(null, { userId: payload.sub })
    }
    return done(null, false)
  })
  passport.use(strategy)

  return [
    passport.initialize(),
    function (req, res, next) {
      passport.authenticate('jwt', { session: false }, function (error, user) {
        if (error || !user) {
          return next(createError(401))
        }

        req.user = user
        return next()
      })(req, res, next)
    }
  ]
}

module.exports = initialize
