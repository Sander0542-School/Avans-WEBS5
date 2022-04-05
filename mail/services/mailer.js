const sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = async function (to, subject, message) {
  try {
    await sendgrid.send({
      to: to,
      from: 'sanderjochems@hotmail.nl',
      subject: subject,
      text: message
    })

    return true
  } catch (e) {
    console.log(e)
  }
  return false
}
