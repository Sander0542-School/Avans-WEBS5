const amqp = require('amqplib')

module.exports = function () {
  const host = process.env.RABBITMQ_HOST || 'rabbitmq'
  const port = parseInt(process.env.RABBITMQ_PORT || '5672')

  return new Promise((resolve, reject) => {
    amqp.connect({
      protocol: 'amqp',
      hostname: host,
      port: port
    })
      .then(connection => {
        resolve(connection)
        console.log(`AMQP connection to ${host}:${port} opened`)
      })
      .catch(error => {
        reject(error)
      })
  })
}
