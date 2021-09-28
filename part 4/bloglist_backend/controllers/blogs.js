const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({}).populate('user' ,{ username: 1, name: 1 })
	response.json(blogs)

})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
	const body = request.body
	const decodedToken = jwt.verify(request.token, process.env.SECRET)


	if(!request.token || !decodedToken.id) {
		return response.status(401).send({
			error: 'token missing or invalid'
		})
	}

	console.log(decodedToken)

	const user = request.user

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	const user = request.user
	const decodedToken = jwt.verify(request.token, process.env.SECRET)

	if(!request.token || !decodedToken || blog.user.toString() !== user._id.toString()) {
		return response.status(401).send({ error : 'Invalid token or Unauthorized User' })
	}

	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body
	const blog = {
		likes: body.likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new : true })
	response.json(updatedBlog)
})

module.exports = blogsRouter