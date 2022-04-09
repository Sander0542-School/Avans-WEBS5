process.env.JWT_SECRET = 'secret'

const app = require('../../app')
const mongoose = require('mongoose')
const request = require('supertest')
const User = require('../../models/user')

const validUser = {
  email: 'john.doe@test.com',
  password: '123456',
  isOwner: true
}

describe('Authenticate Users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  afterAll(async () => {
    mongoose.connection.close()
  })

  it('should be able to register', async () => {
    const res = await request(app)
      .post('/register')
      .send(validUser)

    expect(res.status).toBe(200)
    expect(JSON.parse(res.text).token).toBeDefined()

    const user = await User.findOne({ email: 'john.doe@test.com' })
    expect(user).toBeDefined()
    expect(user.email).toBe(validUser.email)
    expect(user.password).not.toBe(validUser.password) // hashed
    expect(user.isOwner).toBe(validUser.isOwner)
  })

  it('should be able to login', async () => {
    const res = await request(app)
      .post('/register')
      .send(validUser)

    expect(res.status).toBe(200)

    const res2 = await request(app)
      .post('/login')
      .send({
        email: validUser.email,
        password: validUser.password
      })

    expect(res2.status).toBe(200)
    expect(JSON.parse(res2.text).token).toBeDefined()
  })

  it('should handle duplicate email addresses', async () => {
    const res = await request(app)
      .post('/register')
      .send(validUser)

    expect(res.status).toBe(200)

    const res2 = await request(app)
      .post('/register')
      .send(validUser)

    expect(res2.status).toBe(400)
  })
})
