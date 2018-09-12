const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    if(body.password.length < 3) return response.status(400).json({ error: 'password must be atleast 3 characters long' })
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    
    const user = new User({
      username: body.username,
      name: body.name,
      adult: body.adult === undefined ? true : body.adult,
      passwordHash: passwordHash
    })
    
    const exists = await User.find({username: body.username})

    if(exists.length > 0) return response.status(400).json({ error: 'username must be unique' })
    
    else {
        const savedUser = await user.save()
        response.json(User.format(savedUser))
    }
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

usersRouter.get('/', async (request, response) => {
    try {
      const allUsers = await User.find({})
      response.json(allUsers.map(User.format))
    } catch (exception) {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  })
  

module.exports = usersRouter