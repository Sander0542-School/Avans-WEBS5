const axios = require('axios')
const CircuitBreaker = require('opossum')
const jwt = require('./token')

const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
}

function initialize (host, port, token) {
  return new CircuitBreaker((method, uri, user, body) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = axios({
          method: method,
          url: `http://${host}:${port}${uri}`,
          data: body,
          headers: {
            Authorization: `Bearer ${jwt.sign({
              token,
              user
            }, { subject: 'gateway' })}`
          },
          validateStatus: false
        })
        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  }, options)
}

module.exports = initialize
