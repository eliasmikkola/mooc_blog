const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if(blogs.length === 0) return 0
    
    const reducer = (x,y) => x + y;
    return blogs.map(n=>n.likes).reduce(reducer)
}

module.exports = {
    dummy,
    totalLikes
}