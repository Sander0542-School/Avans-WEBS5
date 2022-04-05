const { RabbitMQ } = require('avans-common')
const database = require('./services/database')
const md5 = require('md5')
const Imagga = require('./services/imagga')
const Tag = require('./models/tag')

database.initialize()
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
              const content = JSON.parse(message.content.toString())
              const tags = await imagga.tag(content.image)

              channel.publish(exchange, content.return, Buffer.from(JSON.stringify(tags)))

              const tag = new Tag({
                hash: md5(content.image),
                tags: tags
              })
              tag.save()
            })
          })
      })
  })
  .catch(error => {
    console.error(error)
  })
