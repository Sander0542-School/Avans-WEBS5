const User = require('../models/user')

class Auth {
  getExistingPayload (payload) {
    return new Promise((resolve, reject) => {
      User.findById(payload.sub)
        .exec()
        .then(value => {
          if (value) {
            resolve({
              id: value._id.toString(),
              email: value.email,
              isOwner: value.isOwner
            })
          } else {
            resolve(null)
          }
        }).catch(reason => {
        reject(reason)
      })
    })
  }
}

module.exports = Auth
