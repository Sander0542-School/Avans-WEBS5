const createError = require('http-errors')

module.exports = [
  function (req, res, next) {
    next(createError(404))
  },

  function (err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500).json({ message: err.message })
  }
]
