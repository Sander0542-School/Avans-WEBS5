const AuthService = require('./auth')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const authService = new AuthService()
    const user = await authService.getExistingPayload(payload)

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  } catch (error) {
    done(error, false)
  }
})
passport.use(strategy)

module.exports = passport
