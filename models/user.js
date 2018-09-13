const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    passwordHash: String,
    adult: Boolean,
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.format = (user) => {
    return {
        id: user._id,
        username: user.username,
        name: user.name,
        adult: user.adult,
        blogs: user.blogs
    }
}


module.exports = mongoose.model('User', userSchema)
