const createError = require('http-errors')

module.exports = [
  function (req, res, next) {
    next(createError(404))
  },

  function (err, req, res, next) {
    const status = err.status || 500

    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(status).json({
      code: status,
      message: err.message
    })
  }
]
