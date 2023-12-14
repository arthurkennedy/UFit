const entryRouter = require('express').Router()
const Entry = require('../models/entry')
const User = require('../models/user')
const Team = require('../models/team')
const { authenticate } = require('../utils/middleware')
const { updateUserParticipation } = require('../utils/participationUtils')
const { isValidDraftJsContent } = require('../utils/draftJsContentStateValidation')
const { request, response } = require('express')


entryRouter.post('/', authenticate, async (request, response) => {
	if(!isValidDraftJsContent(request.body.content)) {
		return response.status(400).json({
			error: 'invalid content type'
		})
	}

	const user = await User.findById(request.user.id)

	const entry = new Entry({
		content: request.body.content,
		user: user._id
	})

	await updateUserParticipation(user, false)
	const savedEntry = await entry.save()
	const responseObject = {
		...savedEntry._doc,
		user: { username: user.username, id: user.id, participation_points: user.participation_points }
	}


	response.status(200).json(responseObject)
})

entryRouter.get('/', authenticate, async (request, response) => {
	const user = await User.findById(request.user.id).populate('teams')

	const teamMemberIds = user.teams.reduce((acc, team) => {
		const memberIds = team.members.map(member => member.user)
		const allMembers = [...memberIds, team.admin]
		return acc.concat(allMembers)
	}, [])

	const entries = await Entry
		.find({
			'user': { $in: teamMemberIds },
			'isTopLevel': true
		})
		.sort({ createdAt: -1 })
		.populate('user', 'username picture')


	return response.status(200).json(entries)
})

entryRouter.get('/team', authenticate, async (request, response) => {
	const { teamId } = request.query

	const user = await User.findById(request.user.id)

	const team = await Team.findById(teamId).populate('members').populate('admin')

	if(!team) {
		return response.status(404).json({ error: 'team not found' })
	}

	const teamMemberIds = team.members.map(member => member.user.toString())
	const teamIds = [...teamMemberIds, team.admin._id.toString()]

	if(!teamIds.includes(user._id.toString())) {
		return response.status(405).json({ error: 'user not authorized' })
	}

	const entries = await Entry
		.find({
			'user': { $in: teamMemberIds },
			'isTopLevel': true
		})
		.sort({ createdAt: -1 })
		.populate('user', 'username picture')

	return response.status(200).json(entries)
})


entryRouter.post('/reply', authenticate, async (request, response) => {
	if(!isValidDraftJsContent(request.body.content)) {
		return response.status(400).json({
			error: 'invalid content type'
		})
	}

	const user = await User.findById(request.user.id)
	const { id, content } = request.body

	const newReply = new Entry({ content: content, user: user._id, isTopLevel: false })

	await newReply.save()

	const result = await Entry.findByIdAndUpdate(id, {
		$push: { replies: newReply._id }
	}, { new: true })

	await updateUserParticipation(user, true)

	response.status(200).json(newReply)
})

entryRouter.get('/replies/:postId', authenticate, async (request, response) => {
	const postId = request.params.postId
	const result = await Entry.findById(postId).populate({
		path: 'replies',
		options: { sort: { 'createdAt': -1 } }
	})
	response.status(200).json(result.replies)
})


entryRouter.put('/:id/like', authenticate, async (request, response) => {
	const entryId = request.params.id
	const userId = request.user.id

	const entry = await Entry.findById(entryId)

	if (!entry) {
		return response.status(404).json({ error: 'Entry not found' })
	}

	if (entry.likes.includes(userId)) {
		return response.status(400).json({ error: 'User already liked this post' })
	}

	entry.likes.push(userId)
	const updatedEntry = await entry.save()

	response.status(200).json(updatedEntry)
})


module.exports = entryRouter