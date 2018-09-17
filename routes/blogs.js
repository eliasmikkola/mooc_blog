const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



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
    try {
        const token = request.token
        const decodedToken = !token ? false : jwt.verify(token, process.env.SECRET)
    
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
    
        const user = await User.findById(decodedToken.id)

        if(!blogToSave.url || !blogToSave.title) response.status(400).json({ error: 'fields missing' })
        else {            
            if(user !== null){
                blogToSave['user'] = user._id
                const blog = new Blog(blogToSave)
                
                const savedBlog = await blog.save()
                
                user.blogs = user.blogs.concat(savedBlog._id)
                await user.save()
                

                response.status(201).json(Blog.format(savedBlog))
            }
            else {
                response.status(500).json({ error: 'something went wrong...' })
            }
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({ error: 'something went wrong...' })

    }
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id)
    

    const token = request.token
    const decodedToken = !token ? false : jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if(blog.user.toString() !== user._id.toString()){
        return response.status(403).json({ error: 'no permission to do that' })
    }
    await Blog.findByIdAndRemove(id)
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
