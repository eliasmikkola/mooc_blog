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


test('a valid blog post can be added ', async () => {
    const newBlog = {
        title: "Cats in Computer Science",
        author: "Cat Stevens",
        url: "https://http.cat/",
        likes: 11,
        __v: 0
      }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api
      .get('/api/blogs')
  
    const contents = response.body.map(r => r.title)
  
    expect(response.body.length).toBe(testData.length + 1)
    expect(contents).toContain(newBlog.title)
})

test('if property "likes" has no value, should be assigned a value of 0', async () => {
    const newBlogWithoutLikes= {
        title: "Dogs in Computer Science",
        author: "DOg Stevens",
        url: "https://http.cat/",
        __v: 0
      }
  
    await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api
      .get('/api/blogs')
  
    const contents = response.body.map(r => r.title)
    const lastElement = response.body[response.body.length - 1]

    expect(lastElement.likes).toBe(0)
})


afterAll(() => {
  server.close()
})