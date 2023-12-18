const mongoose = require('mongoose')
const Team = require('../models/team') // Update with the correct path to your Team model
const config = require('../utils/config') // Update with the correct path to your config
const logger = require('../utils/logger') // Update with the correct path to your logger
const TeamInvitation = require('../models/team')
const User = require('../models/user')
mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('Connected to MongoDB')
		update()
	})
	.catch((error) => {
		logger.error('Error connecting to MongoDB:', error.message)
	})

const update = async () => {
	try {
		const teamName = 'Kevin\'s Fam'
		const inviteeNames = ['Dswearson', 'blox', 'bob']
		// Find the team
		const team = await Team.findOne({ name: teamName })
		if (!team) {
			console.log(`Team "${teamName}" not found.`)
			return
		}

		// Find invitations
		const invitations = await Promise.all(
			inviteeNames.map(async (inviteeName) => {
				const invitee = await User.findOne({ username: inviteeName })
				if (!invitee) {
					console.log(`User "${inviteeName}" not found.`)
					return null
				}
				return TeamInvitation.findOne({ invitee: invitee._id, team: team._id })
			})
		)

		// Filter out any null values
		const validInvitations = invitations.filter(invite => invite !== null)

		// Update team with invitation IDs
		team.invitations = team.invitations.concat(validInvitations.map(invite => invite._id))
		await team.save()
		console.log('All teams updated successfully.')
		mongoose.disconnect()
	} catch (error) {
		console.error('Error updating teams:', error)
		mongoose.disconnect()
	}
}

