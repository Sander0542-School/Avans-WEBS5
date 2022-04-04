const { RabbitMQ } = require('avans-common')
const Imagga = require('./services/imagga')

const imagga = new Imagga()

RabbitMQ()
  .then(connection => {
    connection.createChannel()
      .then(channel => {
        const exchange = 'webs.tagger'
        channel.assertExchange(exchange, 'direct')

        channel.assertQueue('', {
          exclusive: true
        })
          .then(queue => {
            channel.bindQueue(queue.queue, exchange, 'request')
            channel.consume(queue.queue, async (message) => {
              console.log('Message received')
              const content = JSON.parse(message.content.toString())
              const tags = await imagga.tag(content.image)
              channel.publish(exchange, content.return, Buffer.from(JSON.stringify(tags)))
            })
          })
      })
  })
  .catch(error => {
    console.error(error)
  })
