const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogRouter.get('/', async(request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user',{ _id: 1, name: 1, username: 1 } )
    response.json(blogs.map(Blog.format))
})

blogRouter.post('/', async (request, response) => {
    var blogToSave = request.body
    if(!blogToSave.likes){
        blogToSave['likes'] = 0
    }
    if(!blogToSave.url || !blogToSave.title) response.status(400).json({ error: 'fields missing' })
    else {
        const users = await User.find({})
        
        if(users.length > 0){
            blogToSave['user'] = users[0]._id
        }
        
        

        const blog = new Blog(blogToSave)
        const savedBlog = await blog.save()

        if(users.length > 0){
            const user = users[0]
            user.blogs = user.blogs.concat(savedBlog._id)
            await user.save()
        }

        response.status(201).json(savedBlog)
    }
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const deleteRes = await Blog.findByIdAndRemove(id)
    response.status(204).send()
})

blogRouter.put('/:id', async (request, response) => {
    
    const id = request.params.id
    const newBlog = request.body
    
    try {
        const user = await Blog.findByIdAndUpdate(id, newBlog, { new: true })
        response.status(202).json(user)
    } catch (exp) {
        console.log(exp);
        response.status(400).json({error: 'Malformed id'})
    }
    
})
module.exports = blogRouter
