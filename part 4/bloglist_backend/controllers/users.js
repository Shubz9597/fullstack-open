const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
	const users = await User.find({})
	response.json(users)
})


userRouter.post('/', async (request, response) => {
	const body = request.body

	if(body.password.length < 3){
		return response.status(401).send({
			error: 'Password length is less than 3, Create another'
		})
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const user = new User({
		username: body.username,
		passwordHash,
		name: body.name
	})

	const savedUser = await user.save()
	response.json(savedUser)
})

module.exports = userRouter