const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'How to',
    author: 'Minna Canth',
    url: 'weburl',
    likes: 912
  },
  {
    title: 'That way',
    author: 'Tarja Halonen',
    url: 'weburl',
    likes: 1276
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('when there are initially some blogs saved ', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blogs is returned', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blogs have id defined ', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0]._id).toBeDefined()
  })

  test('creating new valid blog adds blog to the list of blogs', async () => {
    const newBlog = {
      title: 'Harry',
      author: 'J.K Rowling',
      url: 'weburl',
      likes: 1117
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(contents).toContain(newBlog.title)
  })

  test('creating new blog without likes defaults likes to 0', async () => {
    const newBlog = {
      title: 'Hermione',
      author: 'J.K Rowling',
      url: 'weburl',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toEqual(0)
  })

  test('creating not valid blog returns http 400', async () => {
    const newBlog = {
      author: 'J.K Rowling',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
})