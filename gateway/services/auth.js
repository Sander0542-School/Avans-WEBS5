const User = require('../models/user')

class Auth {
  getExistingPayload (payload) {
    return new Promise((resolve, reject) => {
      User.findById(payload.sub)
        .exec()
        .then(user => {
          if (user) {
            resolve({
              id: user._id.toString(),
              email: user.email,
              isOwner: user.isOwner
            })
          } else {
            resolve(null)
          }
        })
        .catch(reason => {
          reject(reason)
        })
    })
  }
}

module.exports = Auth
