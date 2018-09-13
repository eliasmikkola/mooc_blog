const supertest = require('supertest')
const { app, server } = require('../server')
const api = supertest(app)
const testData = require('../utils/test_users')

const User = require('../models/user')

const usersInDb = async () => {
    const users = await api
        .get('/api/users')
    return users
}

beforeAll(async () => {
    await User.remove({})
    
    await testData.initialUsers.forEach(n => {
        let userObject = new User(n)
        userObject.save()    
    })
})


describe('/api/users POST tests', () => {

    test('user with password < 3 characters should return 400', async () => {
        const usersBefore = await usersInDb()
        const invalidPasswordUser = testData.invalidUsers.invalidPassword

        const result = await api
            .post('/api/users')
            .send(invalidPasswordUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({error: 'password must be atleast 3 characters long' })

    })

    test('with existing username should return 400', async () => {
        const usersBefore = await usersInDb()
        const dublicateUsername = testData.invalidUsers.dublicateUsername

        const result = await api
            .post('/api/users')
            .send(dublicateUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username must be unique' })

    })
    test('valid user should be accepted', async () => {
        const usersBefore = await usersInDb()
        const user = {
            name: 'New User',
            username: 'newuser123',
            password: 'seruceword123'
        }

        const result = await api
            .post('/api/users')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await usersInDb()
        expect(usersBefore.body.length).toBe(usersAfter.body.length -1)
        expect(usersAfter.body.map(n=>n.name)).toContain('New User')
        expect(result.body.adult).toBe(true)
        expect(result.body.username).toBe('newuser123')
    })
})

describe('/api/users GET tests', () => {

    test('user with password < 3 characters should return 400', async () => {
        const usersBefore = await usersInDb()
        const invalidPasswordUser = testData.invalidUsers.invalidPassword

        const result = await api
            .post('/api/users')
            .send(invalidPasswordUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({error: 'password must be atleast 3 characters long' })
    })
})

afterAll(() => {
  server.close()
})