const { RabbitMQ } = require('avans-common')
const Submission = require('../models/submission')
const Target = require('../models/target')

module.exports = function initialize () {
  RabbitMQ()
    .then(connection => {
      connection.createChannel()
        .then(channel => {
          channel.assertQueue('webs.cqrs.target', {
            durable: true
          })
            .then(queue => {
              channel.consume(queue.queue, async message => {
                try {
                  const action = JSON.parse(message.content.toString())

                  switch (action.action) {
                    case 'create':
                      await Target.create(action.data)
                      channel.ack(message)
                      console.log('Target created')
                      break
                    case 'delete':
                      await Target.delete(action.id)
                      channel.ack(message)
                      console.log(`Target ${action.id} deleted`)
                      break
                  }
                } catch (error) {
                  console.error(error)
                }
              })
            })

          channel.assertQueue('webs.cqrs.submission', {
            durable: true
          })
            .then(queue => {
              channel.consume(queue.queue, async message => {
                try {
                  const action = JSON.parse(message.content.toString())

                  switch (action.action) {
                    case 'create':
                      await Submission.create(action.data)
                      channel.ack(message)
                      console.log('Submission created')
                      break
                    case 'delete':
                      await Submission.delete(action.id)
                      channel.ack(message)
                      console.log(`Submission ${action.id} deleted`)
                      break
                  }
                } catch (error) {
                  console.error(error)
                }
              })
            })
        })
    })
    .catch(error => {
      console.error(error)
    })
}
