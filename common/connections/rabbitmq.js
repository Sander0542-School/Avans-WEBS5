const amqp = require('amqplib')

module.exports = function (host, port) {
  host = host || process.env.RABBITMQ_HOST || 'rabbitmq'
  port = port || process.env.RABBITMQ_PORT || '5672'

  return new Promise((resolve, reject) => {
    amqp.connect(`amqp://${host}:${port}`, (error, connection) => {
      if (error) {
        reject(error)
      } else {
        resolve(connection)
      }
    })
  })
}
