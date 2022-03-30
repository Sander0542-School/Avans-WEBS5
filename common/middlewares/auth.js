const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

function initialize (apiKey) {
  const strategy = new JwtStrategy(options, (payload, done) => {
    console.log(payload)
    if (payload.token && payload.token === apiKey) {
      return done(null, { userId: payload.sub })
    }
    return done(null, false)
  })
  passport.use(strategy)

  return [
    passport.initialize(),
    passport.authenticate('jwt', { session: false })
  ]
}

module.exports = initialize
