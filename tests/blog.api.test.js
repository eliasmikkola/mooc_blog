const supertest = require('supertest')
const { app, server } = require('../server')
const api = supertest(app)
const testData = require('../utils/blog-list')

const Blog = require('../models/blog')

beforeAll(async () => {
    await Blog.remove({})
    
    await testData.forEach(n => {
        let blogObject = new Blog(n)
        blogObject.save()    
    })
})


test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api
        .get('/api/blogs')
    expect(response.body.length).toBe(testData.length)
})

test('a specific blog is within the returned notes', async () => {
    const response = await api
        .get('/api/blogs')
  
    const contents = response.body.map(r => r.title)
  
    expect(contents).toContain('Go To Statement Considered Harmful')
})


afterAll(() => {
  server.close()
})