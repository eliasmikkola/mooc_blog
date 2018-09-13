const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

//routers
const blogRouter = require('./routes/blogs')
const userRouter = require('./routes/users')
const loginRouter = require('./routes/login')


const config = require('./utils/config')
const middleware = require('./utils/middleware')

const testing = process.env.NODE_ENV === 'test'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoUrl = config.mongoUrl

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true
  })
  .then( () => {
    if(!testing) console.log('connected to database', mongoUrl)
  })
  .catch( err => {
    console.log(err)
  })

app.use(cors())
app.use(bodyParser.json())

app.use(middleware.logger)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.error)

const PORT = config.port
const server = http.createServer(app)

server.listen(PORT, () => {
  if(!testing) console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}