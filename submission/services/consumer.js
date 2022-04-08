const Target = require('../models/target')

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
    })
}

module.exports = initialize
