const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})
 
  
blogRouter.post('/', async (request, response) => {
    var blogToSave = request.body
    if(!blogToSave.likes){
        blogToSave['likes'] = 0
    }
    if(!blogToSave.url || !blogToSave.title) response.status(400).json({ error: 'fields missing' })
    else {
        const blog = new Blog(blogToSave)
        const res = await blog.save()
        response.status(201).json(res)
    }
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const deleteRes = await Blog.findByIdAndRemove(id)
    response.status(204).send()
})

module.exports = blogRouter
