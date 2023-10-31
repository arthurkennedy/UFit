const Team = require('../models/team')
const User = require('../models/user')
const { authenticate } = require('../utils/middleware')
const teamRouter = require('express').Router()

teamRouter.post('/', authenticate, async (request, response) => {
	const admin = await User.findById(request.user.id)

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
