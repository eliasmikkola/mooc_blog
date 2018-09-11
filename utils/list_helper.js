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

const mostLikes = (blogs) => {
    const names = blogs.map( n => n.author )
    //get names
    const uniqueNames = names.filter( (item, pos) => {
        return names.indexOf(item) == pos;
    })
    //map unique names to objects, containing the name field and array of blogs with that author name
    const authors = uniqueNames.map(name => {
        return {
            name: name,
            blogs: blogs.filter( blog => blog.author === name)
        }
    })
    //map names and blogs by author to name and likes for every blog 
    const sortedByLikes = authors.map(author => {
        return {
            author: author.name,
            likes: author.blogs.reduce((prev, curr) => {
                return prev.likes + curr.likes
            })

        }
    })
    //and sort by total likes
    .sort((a,b) => b.likes - a.likes)[0]
    //pick only wanted properties
    var {author, likes} = sortedByLikes
    return {author, likes}
}

module.exports = {
    dummy,
    totalLikes,
    mostBlogs,
    favouriteBlog,
    mostLikes
}