const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    adult: Boolean
})

userSchema.statics.format = (user) => {
    return {
        id: user._id,
        username: user.username,
        name: user.name,
        adult: user.adult
    }
}


module.exports = mongoose.model('User', userSchema)
