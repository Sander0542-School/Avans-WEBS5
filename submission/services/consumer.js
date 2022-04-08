const Target = require('../models/target')
const Submission = require('../models/submission')

function initialize (rabbitMqConnection) {
  rabbitMqConnection.createChannel()
    .then(channel => {
      channel.assertQueue('webs.submission.target', {
        durable: true
      })
        .then(queue => {
          channel.consume(queue.queue, message => {
            const content = JSON.parse(message.content.toString())

            Target.create(content)
              .then(target => {
                console.log(`Target ${target._id} created`)
                channel.ack(message)
              })
              .catch(error => {
                console.log(error)
              })
          })
        })

      channel.assertQueue('webs.submission.tags', {
        durable: true
      })
        .then(queue => {
          channel.consume(queue.queue, message => {
            const content = JSON.parse(message.content.toString())

            Submission.findByIdAndUpdate(content.documentId, { tags: content.tags }, { returnDocument: 'after' })
              .then(submission => {
                console.log(`Updated submission ${submission._id} with ${content.tags.count} tags`)
                channel.ack(message)

                channel.assertQueue('webs.cqrs.submission', { durable: true })
                  .then(queue => {
                    channel.sendToQueue(queue.queue, Buffer.from(JSON.stringify({
                      action: 'create',
                      data: submission
                    })))
                  })
              })
              .catch(error => {
                console.error(error)
              })
          })
        })
    })
}

module.exports = initialize
