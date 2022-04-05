const { RabbitMQ } = require('avans-common')
const database = require('./services/database')
const Mail = require('./models/mail')
const mailer = require('./services/mailer')

database.initialize()

RabbitMQ()
  .then(connection => {
    connection.createChannel()
      .then(channel => {
        const exchange = 'webs.mail'
        channel.assertExchange(exchange, 'direct')

        channel.assertQueue('', {
          exclusive: true
        })
          .then(queue => {
            channel.bindQueue(queue.queue, exchange, 'send')
            channel.consume(queue.queue, async (message) => {
              const content = JSON.parse(message.content.toString())
              const success = await mailer(content.to, content.subject, content.message)

              const mail = new Mail({
                success: success,
                ...content
              })
              mail.save()
            })
          })
      })
  })
  .catch(error => {
    console.error(error)
  })
