const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const params = request.body
  params.likes = params.likes || 0
  if (params.title === undefined && params.url === undefined) {
    response.status(400).json('title or url required')
    return
  }
  const blog = new Blog(params)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(201).json('deleted')
})

blogsRouter.put('/:id', async (request, response) => {
  const params = request.body

  if (params.title === undefined && params.url === undefined) {
    response.status(400).json('title or url required')
    return
  }

  const blog = {
    title: params.title,
    author: params.author,
    url: params.url,
    likes: params.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter