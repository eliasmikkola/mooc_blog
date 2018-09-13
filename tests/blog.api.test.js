const supertest = require('supertest')
const { app, server } = require('../server')
const api = supertest(app)
const testData = require('../utils/blog-list')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')



var user1authToken = ""
var user2authToken = ""

const blogsInDb = async () => {
    const blogs = await api
        .get('/api/blogs')
    return blogs
}


beforeAll(async () => {


    const saltRounds = 10
    const hashedPassWord = await bcrypt.hash("password1", saltRounds)

    const user1 = new User({
        "name": "Tester testerr",
        "passwordHash": hashedPassWord,
        "username": "testuser123",
        "adult": true
    })

    const user2 = new User({
        "name": "Tester testerr",
        "passwordHash": hashedPassWord,
        "username": "testuser1234",
        "adult": false
    })




    await Blog.remove({})
    await User.remove({})

    const user1response = await user1.save()
    await user2.save()

    const loginResp1 = await api
        .post('/api/login')
        .send({
            username: "testuser123",
            password: "password1"
        })
    user1authToken = loginResp1.body.token

    const loginResp2 = await api
        .post('/api/login')
        .send({
            username: "testuser1234",
            password: "password1"
        })
    user2authToken = loginResp2.body.token
    
    await testData.forEach(n => {
        n["user"] = user1response._id
        let blogObject = new Blog(n)
        blogObject.save()
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
        
        const blogsBefore = await blogsInDb()
        
        await api
            .post('/api/blogs')
            .set({'Authorization': `Bearer ${user1authToken}`})
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAfter = await blogsInDb()
        
        const contents = blogsAfter.body.map(r => r.title)
    
        expect(blogsAfter.body.length).toBe(blogsBefore.body.length + 1)
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
            .set({'Authorization': `Bearer ${user1authToken}`})
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
            .set({'Authorization': `Bearer ${user1authToken}`})
            .send(newBlogWithoutTitle)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        await api
            .post('/api/blogs')
            .send(newBlogWithoutUrl)
            .set({'Authorization': `Bearer ${user1authToken}`})
            .expect(400)
            .expect('Content-Type', /application\/json/)
    
        const response = await blogsInDb()
    
        const contents = response.body.map(r => r.title)
        const lastElement = response.body[response.body.length - 1]

        expect(lastElement.likes).toBe(0)
    })

    test('post without token should return status 401 ', async () => {
        const newBlog = {
            title: "Cats in Computer Science",
            author: "Cat Stevens",
            url: "https://http.cat/",
            likes: 11,
            __v: 0
        }
        
        const blogsBefore = await blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    
        const blogsAfter = await blogsInDb()
        
    
        expect(blogsAfter.body.length).toBe(blogsBefore.body.length)
    })
})

describe('GET api tests', () => {

    test('blogs are returned as json', async () => {
    const blogsBefore = await blogsInDb()
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })


    test('a specific blog is within the returned blogs', async () => {
        const response = await blogsInDb()
    
        const contents = response.body.map(r => r.title)
    
        expect(contents).toContain('Go To Statement Considered Harmful')
    })
})

describe('DELETE api tests', () => {

    test('should be able to delete own blogs', async () => {
        const blogsBefore = await blogsInDb()
        
        const blogToDelete = blogsBefore.body[0]
        const idToDelete = blogToDelete['id']
        const titleToRemove = blogToDelete['title']
        
        const answer = await api
            .delete(`/api/blogs/${idToDelete}`)
            .set({'Authorization': `Bearer ${user1authToken}`})
            .expect(204)
            
        const blogsAfter = await blogsInDb()
        expect(blogsAfter.body.length).toBe(blogsBefore.body.length - 1)
        expect(blogsAfter.body.map(n=>n.title)).not.toContain(titleToRemove)

    })

    test('should not be able to delete other\'s blogs', async () => {
        const blogsBefore = await blogsInDb()
        
        

        const blogToDelete = blogsBefore.body[0]
        const idToDelete = blogToDelete['id']
        const titleToRemove = blogToDelete['title']
        
        await api
            .delete(`/api/blogs/${idToDelete}`)
            .set({'Authorization': `Bearer ${user2authToken}`})
            .send()
            .expect(403)

        const blogsAfter = await blogsInDb()
        expect(blogsAfter.body.length).toBe(blogsBefore.body.length)

        expect(blogsAfter.body.map(n=>n.title)).toContain(titleToRemove)

    })
})

describe('PUT api tests', () => {
    
    test('update single blog', async () => {
    
        const blogsBefore = await blogsInDb()
        var blogToUpdate = blogsBefore.body[0]
        
        const idToUpdate = blogToUpdate['id']
        const titleBeforeUpdate = blogToUpdate['title']

        blogToUpdate['title'] = 'New Updated Title'
        await api
            .put(`/api/blogs/${idToUpdate}`)
            .send(blogToUpdate)
            .expect(202)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter.body.length).toBe(blogsBefore.body.length)
        const titles = blogsAfter.body.map(n=>n.title)
        
        expect(titles).toContain('New Updated Title')
        
        expect(titles).not.toContain(titleBeforeUpdate)

    })
})

afterAll(() => {
  server.close()
})