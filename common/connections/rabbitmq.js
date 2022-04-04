const amqp = require('amqplib')

module.exports = async function (host, port) {
  host = host || process.env.RABBITMQ_HOST || 'rabbitmq'
  port = port || process.env.RABBITMQ_PORT || '5672'

  return await amqp.connect(`amqp://${host}:${port}`)
}
