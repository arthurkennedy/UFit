const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Team = require('../models/team')
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
		invitations: [],
		teams: [],
		weight: body.weight,
		height: body.height
	})

	const savedUser = await user.save()
	response.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
	const decodedToken = helper.parseToken(req)
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

usersRouter.get('/search', async (request, response) => {
	const teamId = request.query.teamId
	const searchTerm = request.query.searchTerm || ''

	if (teamId) {
		const team = await Team.findById(teamId)
		if(!team) {
			return response.status(404).json({ error: 'team not found' })
		}
	}

	const users = await User.find({
		username: new RegExp(searchTerm, 'i'),
		teams: { $ne: teamId }
	}, 'username _id')
		.sort({ username: 1 })
		.limit(20)

	response.status(200).json(users)
})

module.exports = usersRouter
