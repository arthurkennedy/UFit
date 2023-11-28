const User = require('../models/user')
const Team = require('../models/team')
const TeamInvitation = require('../models/team_invitation')
const { authenticate } = require('../utils/middleware')
const teamInvitationRouter = require('express').Router()

teamInvitationRouter.post('/', authenticate, async (request, response) => {
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
	response.status(200).json(savedTeamInvitation)
})

teamInvitationRouter.get('/', authenticate, async (request, response) => {
	// Find all invitations for this user
	const invitations = await TeamInvitation.find({ invitee: request.user.id })

	// Populate the 'team' field to include more information about each team
	await TeamInvitation.populate(invitations, { path: 'team', select: 'name' })

	response.status(200).json(invitations)
})


teamInvitationRouter.put('/:invitationId', authenticate, async (request, response) => {
	const user = await User.findById(request.user.id)
	const invitationId = request.params.invitationId
	const action = request.body.action
	const invitation = await TeamInvitation.findById(invitationId)

	if(invitation.state === 'ACCEPTED') {
		return response.status(404).json({ error: 'invitation already accepted' })
	}
	if(!invitation || invitation.invitee.toString() !== user._id.toString()) {
		return response.status(404).json({ error: 'invitation not found or unauthorized user' })
	}
	const team = await Team.findById(invitation.team)
	if(action === 'ACCEPT') {
		if(!team.members.map(member => member.user).includes(user._id) && !user.teams.includes(team._id)) {
			team.members = team.members.concat({ user: user._id })
			user.teams = user.teams.concat(team._id)
			await team.save()
			await user.save()
			invitation.state = 'ACCEPTED'
			await invitation.save()
		} else {
			return response.status(404).json({ error: 'Error, user already a member of team' })
		}
	} else if (action === 'REJECTED') {
		invitation.state = 'REJECTED'
		await invitation.save()
	} else {
		return response.status(400).json({ error: 'invalid action' })
	}

	response.status(200).json({ invitation: invitation, team: team })
})

module.exports = teamInvitationRouter
