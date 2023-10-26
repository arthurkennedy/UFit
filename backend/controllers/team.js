const helper = require('./controller_helper')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Team = require('../models/team')
const teamRouter = require('express').Router()

teamRouter.post('/', async (request, response) => {
	const decodedToken = jwt.verify(helper.parseToken(request), process.env.SECRET)

	if (!decodedToken.id) {
		return response.status(401).json({ error: 'invalid authorization token' })
	}

	const admin = await User.findById(decodedToken.id)

	const team = new Team({
		name: request.body.name,
		members: [],
		admin: admin._id
	})

	const savedTeam = await team.save()
	response.json(savedTeam)
})

module.exports = teamRouter
