const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if(blogs.length === 0) return 0
    
    const reducer = (x,y) => x + y;
    return blogs.map(n=>n.likes).reduce(reducer)
}

const mostBlogs = (blogs) => {
    const names = blogs.map( n => n.author )
    const uniqueNames = names.filter( (item, pos) => {
        return names.indexOf(item) == pos;
    })
    const uniq = uniqueNames.map(name => {
        return {
            author: name,
            blogs: blogs.filter(blog => name === blog.author).length
        }
    }).sort((a,b) =>  b.blogs - a.blogs);
    console.log(uniq)
    return uniq[0]

}

const favouriteBlog = (blogs) => {
    const favourite = blogs.sort((a,b) =>  b.likes - a.likes)[0]
    return {
        author: favourite.author,
        title: favourite.title,
        likes: favourite.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    mostBlogs,
    favouriteBlog
}