const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length < 0) {
    return {}
  }

  const reducer = (highest, item) => {
    if(item.likes > highest.likes) {
      return item
    } else {
      return highest
    }
  }
  const highest = blogs.reduce(reducer, blogs[0])
  delete highest._id
  delete highest.__v
  delete highest.url
  return highest
}

const mostBlogs = (blogs) => {
  const authorBlogs = _(blogs)
    .groupBy('author')
    .map((authorBlogs, authorName) => ({
      author: authorName,
      blogs: authorBlogs.length
    }))
    .value()
  const reducer = (highest, author) => (author.blogs > highest.blogs) ? author : highest
  return  authorBlogs.reduce(reducer, authorBlogs[0])
}

const mostLikes = (blogs) => {
  const authorsWithLikes = _(blogs)
    .groupBy('author')
    .map((authorBlogs, authorName) => ({
      author: authorName,
      likes: _.sumBy(authorBlogs, 'likes')
    }))
    .value()
  const reducer = (highest, author) => (author.likes > highest.likes) ? author : highest
  return authorsWithLikes.reduce(reducer, authorsWithLikes[0])
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}