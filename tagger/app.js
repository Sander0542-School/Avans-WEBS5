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
        const queueName = 'webs.tagger'
        channel.assertQueue(queueName, {
          durable: true
        })
          .then(queue => {
            channel.consume(queue.queue, async (message) => {
              const content = JSON.parse(message.content.toString())
              const tags = await imagga.tag(content.image)

              channel.assertQueue(`${queueName}.${content.sender}`, {
                durable: true
              })
                .then(returnQueue => {
                  channel.sendToQueue(returnQueue.queue, Buffer.from(JSON.stringify(tags)), {
                    persistent: true
                  })
                })

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
