const { RabbitMQ } = require('avans-common')
const database = require('./services/database')
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

              channel.assertQueue(content.sender, {
                durable: true
              })
                .then(returnQueue => {
                  channel.sendToQueue(returnQueue.queue, Buffer.from(JSON.stringify({
                    documentId: content.documentId,
                    tags
                  })), {
                    persistent: true
                  })
                  channel.ack(message)
                })

              Tag.create({
                documentId: content.documentId,
                tags: tags
              })
                .then(() => {
                  console.log('Tag saved')
                })
                .catch(error => {
                  console.error(error)
                })
            })
          })
      })
  })
  .catch(error => {
    console.error(error)
  })
