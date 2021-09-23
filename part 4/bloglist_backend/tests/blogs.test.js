const supertest = require('supertest')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
//const User = require('../models/user')


beforeEach(async () => {
	await Blog.deleteMany({})
	await Blog.insertMany(helper.blogs)
})

describe('when there is intially some notes saved', () => {
	test('Blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('Blogs have the property as id', async () => {
		const response = await api.get('/api/blogs')

		expect(response.body[0].id).toBeDefined()

	})
})

describe('addition of a new note', () => {
	test('A blog can be added succesfully', async () => {
		const newBlog = helper.listWithOneBlog[0]

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1)

		const titles = blogsAtEnd.map(n => n.title)
		expect(titles).toContain(
			'Go To Statement Considered Harmful'
		)
	})

	test('To check if the default value of likes in a blog is coming 0', async () => {
		const blog = {
			title : 'Rickroll',
			author : 'Rick Ashtley',
			url : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
		}
		await api
			.post('/api/blogs')
			.send(blog)
			.expect(201)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd[helper.blogs.length].likes).toBe(0)
	})

	test('To check if the title and url property missing is coming fine with correct status code', async () => {
		const blog = {
			author : 'Rick Ashtley',
			url : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
		}

		await api
			.post('/api/blogs')
			.send(blog)
			.expect(400)

		const blogWithoutURL = {
			title : 'Rickroll',
			author : 'Rick Ashtley',
		}

		await api
			.post('/api/blogs')
			.send(blogWithoutURL)
			.expect(400)
	})
})

describe('Check for a particular blog', () => {
	test('dummy return 1', () => {
		const blogs = []
		expect(listHelper.dummy(blogs)).toBe(1)
	})
})

describe('total likes', () => {

	test('of empty list is zero', () => {
		var result = listHelper.totalLikes(helper.listWithNoBlog)
		expect(result).toBe(0)
	})

	test('when list has only one blog equals the likes of that', () => {
		const result = listHelper.totalLikes(helper.listWithOneBlog)
		expect(result).toBe(5)
	})

	test('of a bigger list is calculated right', () => {
		expect(listHelper.totalLikes(helper.blogs)).toBe(36)
	})
})

describe('most likes', () => {
	test('of the empty list', () => {
		expect(listHelper.favoriteBlog(helper.listWithNoBlog)).toEqual({})
	})

	test('when list has only one blog equals the likes of that', () => {
		expect(listHelper.favoriteBlog(helper.listWithOneBlog)).toEqual(helper.listWithOneBlog[0])
	})

	test('of the blog with a bigger list', () => {
		var result = listHelper.favoriteBlog(helper.blogs)
		expect(result).toEqual(helper.blogs[2])
	})
})

describe('Addition of a User', () => {
	test('of the user with short Username than required length', async () => {
		const user = {
			name: 'test',
			password: 'test123',
			username: 'te'
		}

		await api
			.post('/api/users')
			.send(user)
			.expect(400)
	})

	test('of the user with short password than the required length', async () => {
		const user = {
			name: 'test',
			password: 'te',
			username: 'tesdfs'
		}

		await api
			.post('/api/users')
			.send(user)
			.expect(401)
	})
})

afterAll(() => {
	mongoose.connection.close()
})