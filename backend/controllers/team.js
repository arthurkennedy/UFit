const helper = require('./controller_helper')
const User = require('../models/user')
const Team = require('../models/team')
const teamRouter = require('express').Router()

teamRouter.post('/', async (request, response) => {
	const decodedToken = helper.parseToken(request)

	if (!decodedToken.id) {
		return response.status(401).json({ error: 'invalid authorization token' })
	}

	const admin = await User.findById(decodedToken.id)

	const team = new Team({
		name: request.body.name,
		members: [],
		invitations: [],
		admin: admin._id
	})

	const savedTeam = await team.save()
	admin.teams = admin.teams.concat(savedTeam._id)
	await admin.save()
	response.status(200).json(savedTeam)
})

module.exports = teamRouter
