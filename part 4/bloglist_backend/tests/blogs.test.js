const supertest = require('supertest')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)


test('Blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test.only('Blogs have the property as id', async () => {
	const response = await api.get('/api/blogs')

	expect(response.body[0].id).toBeDefined()

})

test('dummy return 1', () => {
	const blogs = []
	expect(listHelper.dummy(blogs)).toBe(1)
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

afterAll(() => {
	mongoose.connection.close()
})