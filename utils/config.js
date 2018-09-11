if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  let port = process.env.PORT
  let mongoUrl = process.env.MONGO_DB_URL
  
  if (process.env.NODE_ENV === 'test') {
    port = process.env.TEST_PORT
    mongoUrl = process.env.TEST_MONGO_DB_URL
  }
  
  module.exports = {
    mongoUrl,
    port
  }
  