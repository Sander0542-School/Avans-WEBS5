const AuthService = require('./auth')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const strategy = new JwtStrategy(options, (payload, done) => {
  const authService = new AuthService()
  authService.getExistingPayload(payload)
    .then(user => {
      if (!user) return done(null, false)
      if (user) return done(null, user)
    })
    .catch(error => {
      return done(error, false)
    })
})
passport.use(strategy)

module.exports = passport
