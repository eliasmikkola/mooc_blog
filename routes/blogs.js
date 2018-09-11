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
    const blog = new Blog(blogToSave)
    
    const res = await blog.save()
    response.status(201).json(res)
})

module.exports = blogRouter
