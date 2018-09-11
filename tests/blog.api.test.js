const supertest = require('supertest')
const { app, server } = require('../server')
const api = supertest(app)
const testData = require('../utils/blog-list')

const Blog = require('../models/blog')

const blogsInDb = async () => {
    const blogs = await api
        .get('/api/blogs')
    return blogs
}

beforeAll(async () => {
    await Blog.remove({})
    
    await testData.forEach(n => {
        let blogObject = new Blog(n)
        blogObject.save()    
    })
})


describe('GET api tests', () => {

    test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await blogsInDb()
        expect(response.body.length).toBe(testData.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await blogsInDb()
    
        const contents = response.body.map(r => r.title)
    
        expect(contents).toContain('Go To Statement Considered Harmful')
    })
})
describe('POST api tests', () => {

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
    
        const response = await blogsInDb()
    
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
    
        const response = await blogsInDb()
    
        const contents = response.body.map(r => r.title)
        const lastElement = response.body[response.body.length - 1]

        expect(lastElement.likes).toBe(0)
    })


    test('POSTs missing properties "title" and "url" should return 400', async () => {
        const newBlogWithoutUrl= {
            title: 'Dogs in Computer Science',
            author: 'Dog Stevens',
            __v: 0
        }
        const newBlogWithoutTitle= {
            url: 'https://http.cat',
            author: 'Dog Stevens',
            __v: 0
        }
    
        await api
        .post('/api/blogs')
        .send(newBlogWithoutTitle)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        await api
        .post('/api/blogs')
        .send(newBlogWithoutUrl)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
        const response = await blogsInDb()
    
        const contents = response.body.map(r => r.title)
        const lastElement = response.body[response.body.length - 1]

        expect(lastElement.likes).toBe(0)
    })
})


afterAll(() => {
  server.close()
})