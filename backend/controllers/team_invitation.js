const helper = require('./controller_helper')
const User = require('../models/user')
const Team = require('../models/team')
const TeamInvitation = require('../models/team_invitation')
const teamInvitationRouter = require('express').Router()

teamInvitationRouter.post('/', async (request, response) => {
	const decodedToken = helper.parseToken(request)

	if (!decodedToken.id) {
		return response.status(401).json({ error: 'invalid authorization token' })
	}

	const admin = await User.findById(request.body.admin)
	const invitee = await User.findById(request.body.invitee)
	const team = await Team.findById(request.body.team)

	if (admin._id.toString() !== team.admin.toString()) {
		return response.status(401).json({ error: 'user must be admin' })
	}

	const teamInvitation = new TeamInvitation({
		team: team._id,
		invitee: invitee._id,
	})

	const savedTeamInvitation = await teamInvitation.save()

	team.invitations = team.invitations.concat(savedTeamInvitation._id)
	invitee.invitations = invitee.invitations.concat(savedTeamInvitation._id)
	await invitee.save()
	await team.save()
	response.json(savedTeamInvitation)
})

teamInvitationRouter.get('/', async (request, response) => {
	const decodedToken = helper.parseToken(request)

	if (!decodedToken.id) {
		return response.status(401).json({ error: 'invalid authorization token' })
	}

	// Find all invitations for this user
	const invitations = await TeamInvitation.find({ invitee: decodedToken.id })

	// Populate the 'team' field to include more information about each team
	await TeamInvitation.populate(invitations, { path: 'team', select: 'name' })

	response.status(200).json(invitations)
})


teamInvitationRouter.put('/:invitationId', async (request, response) => {
	const decodedToken = helper.parseToken(request)
	console.log(decodedToken)
	if(!decodedToken || !decodedToken.id) {
		return response.status(401).json({ error: 'invalid authorization token' })
	}

	const user = await User.findById(decodedToken.id)
	const invitationId = request.params.invitationId
	const action = request.body.action
	const invitation = await TeamInvitation.findById(invitationId)

	let responseMessage = ''

	if(!invitation || invitation.invitee.toString() !== user._id.toString()) {
		return response.status(404).json({ error: 'invitation not found or unauthorized user' })
	}

	if(action === 'ACCEPT') {
		const team = await Team.findById(invitation.team)
		team.members = team.members.concat(user._id)
		await team.save()

		user.teams = user.teams.concat(team._id)
		await user.save()
		responseMessage = 'Invitation accepted.'
	} else if (action ==='REJECTED') {
		responseMessage = 'Invitation rejected.'
	} else {
		return response.status(400).json({ error: 'invalid action' })
	}

	response.status(200).json({ message: responseMessage })
})

module.exports = teamInvitationRouter
