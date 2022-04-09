const Target = require('../models/target')
const Submission = require('../models/submission')

function initialize (rabbitMqConnection) {
  rabbitMqConnection.createChannel()
    .then(async channel => {
      const targetQueue = await channel.assertQueue('webs.submission.target', { durable: true })
      channel.consume(targetQueue.queue, async message => {
        try {
          const content = JSON.parse(message.content.toString())

          const target = await Target.create(content)
          console.log(`Target ${target._id} created`)

          channel.ack(message)
        } catch (error) {
          console.log(error)
        }
      })

      const tagsQueue = await channel.assertQueue('webs.submission.tags', { durable: true })
      channel.consume(tagsQueue.queue, async message => {
        try {
          const content = JSON.parse(message.content.toString())

          const submission = await Submission.findByIdAndUpdate(content.documentId, { tags: content.tags }, { returnDocument: 'after' })
          console.log(`Updated submission ${submission._id} with ${content.tags.count} tags`)

          const cqrsQueue = await channel.assertQueue('webs.cqrs.submission', { durable: true })
          channel.sendToQueue(cqrsQueue.queue, Buffer.from(JSON.stringify({
            action: 'create',
            data: submission
          })), {
            persistent: true
          })

          channel.ack(message)
        } catch (error) {
          console.log(error)
        }
      })
    })
}

module.exports = initialize
