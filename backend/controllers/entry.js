const helper = require('./controller_helper')
const entryRouter = require('express').Router()
const User = require('../models/user')
const Entry = require('../models/entry')

entryRouter.post('/', async (request, response) => {
	const body = request.body
	const decodedToken = helper.parseToken(request)

	if (!decodedToken.id) {
		return response.status(401).json({ error: 'invalid authorization token' })
	}

	const user = await User.findById(decodedToken.id)

	const entry = new Entry({
		content: body.content,
		user: user._id
	})

	const savedEntry = await entry.save()
	const responseObject = {
		...savedEntry._doc,
		user: { username: user.username, id: user.id }
	}

	response.status(200).json(responseObject)
})

entryRouter.get('/', async (request, response) => {
	const decodedToken = helper.parseToken(request)

	if (!decodedToken.id) {
		return response.status(401).json({ error: 'invalid authorization token' })
	}

	const user = await User.findById(decodedToken.id).populate('teams')

	const teamMemberIds = user.teams.reduce((acc, team) => {
		const allMembers = [...team.members, team.admin]
		return acc.concat(allMembers)
	}, [])

	const entries = await Entry
		.find({
			$or: [{ 'user': { $in: teamMemberIds } }]
		})
		.sort({ createdAt: -1 })
		.populate('user', 'username')

	return response.status(200).json(entries)
})

module.exports = entryRouter