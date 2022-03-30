const axios = require('axios')
const CircuitBreaker = require('opossum')
const jwt = require('./token')

const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
}

function initialize (host, port, token) {
  return new CircuitBreaker(function (method, uri, userId, body) {
    return new Promise((resolve, reject) => {
      axios({
        method: method,
        url: `http://${host}:${port}/${uri}`,
        data: body,
        headers: {
          'Authorization': `Bearer ${jwt.sign({ token }, { subject: userId })}`
        }
      }).then(response => {
        resolve(response.data)
      }).catch(reject)
    })
  }, options)
}

module.exports = initialize
