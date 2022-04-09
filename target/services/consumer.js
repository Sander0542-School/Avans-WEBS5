const Target = require('../models/target')

function initialize (rabbitMqConnection) {
  rabbitMqConnection.createChannel()
    .then(channel => {
      channel.assertQueue('webs.target.tags', {
        durable: true
      })
        .then(queue => {
          channel.consume(queue.queue, message => {
            const content = JSON.parse(message.content.toString())

            Target.findByIdAndUpdate(content.documentId, { tags: content.tags }, { returnDocument: 'after' })
              .then(target => {
                console.log(`Updated target ${target._id} with ${content.tags.count} tags`)
                channel.ack(message)

                channel.assertQueue('webs.cqrs.target', { durable: true })
                  .then(queue => {
                    channel.sendToQueue(queue.queue, Buffer.from(JSON.stringify({
                      action: 'create',
                      data: target
                    })))
                  })
                channel.assertQueue('webs.submission.target', { durable: true })
                  .then(queue => {
                    channel.sendToQueue(queue.queue, Buffer.from(JSON.stringify({
                      action: 'create',
                      data: {
                        _id: target._id.toString(),
                        userId: target.userId.toString()
                      }
                    })))
                  })
              })
              .catch(error => {
                console.error(error)
              })
          })
        })
    })
    .catch(error => {
      console.error(error)
    })
}

module.exports = initialize
