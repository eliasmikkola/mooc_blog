const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const blogRouter = require('./routes/blogs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoUrl = process.env.MONGO_DB_URL

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true
  })
  .then( () => {
    console.log('connected to database', mongoUrl)
  })
  .catch( err => {
    console.log(err)
  })

app.use(cors())
app.use(bodyParser.json())


app.use('/api/blogs', blogRouter)
 

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})