const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const helper = require('./controller_helper')

usersRouter.post('/', async (request, response) => {
	const body = request.body

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const user = new User({
		username: body.username,
		passwordHash: passwordHash,
		firstname: body.firstname,
		lastname: body.lastname,
		email: body.email,
		age: body.age,
		gender: body.gender,
		weight: body.weight,
		height: body.height
	})

	const savedUser = await user.save()
	response.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
	const decodedToken = jwt.verify(helper.parseToken(req), process.env.SECRET)
	if (!decodedToken.id) {
		return res.status(401).json({ error: 'invalid authorization token' })
	}
	const user = await User.findById(decodedToken.id)
	if (user) {
		return res.json(user.toJSON())
	} else {
		return res.status(404).end()
	}
})

module.exports = usersRouter
