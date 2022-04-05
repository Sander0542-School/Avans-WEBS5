const { RabbitMQ } = require('avans-common')
const database = require('./services/database')
const Mail = require('./models/mail')
const mailer = require('./services/mailer')

database.initialize()

RabbitMQ()
  .then(connection => {
    connection.createChannel()
      .then(channel => {
        channel.assertQueue('webs.mail', {
          durable: true
        })
          .then(queue => {
            channel.consume(queue.queue, async (message) => {
              const content = JSON.parse(message.content.toString())
              const success = await mailer(content.to, content.subject, content.message)

              if (success) {
                console.log(`Mail sent to ${content.to}`)
              } else {
                console.log(`Could not send mail to ${content.to}`)
              }

              const mail = new Mail({
                success: success,
                ...content
              })
              mail.save()
            }, {
              noAck: true
            })
          })
      })
  })
  .catch(error => {
    console.error(error)
  })
