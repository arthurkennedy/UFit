const mongoose = require('mongoose')
const Team = require('../models/team') // Update with the correct path to your Team model
const config = require('../utils/config') // Update with the correct path to your config
const logger = require('../utils/logger') // Update with the correct path to your logger

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('Connected to MongoDB')
		updateTeams()
	})
	.catch((error) => {
		logger.error('Error connecting to MongoDB:', error.message)
	})

const updateTeams = async () => {
	try {
		const teams = await Team.find({})
		for (const team of teams) {
			// Initialize new members array and subscription object
			let newMembers = []
			if (team.members) {
				newMembers = team.members.map(memberId => ({
					user: memberId,
					pointsEarnedLastDistribution: 0,
					totalPointsEarned: 0,
					subscribed: false
				}))
			}

			const newSubscription = {
				schedule: team.subscription?.schedule || 'MONTHLY',
				distributionSchedule: team.subscription?.distributionSchedule || 'WEEKLY',
				type: team.subscription?.type || 'FREE',
				pointPool: team.subscription?.pointPool || 0,
				pointsPerDistribution: team.subscription?.pointsPerDistribution || 0,
				nextDistributionDate: team.subscription?.nextDistributionDate || new Date(),
				nextSubscriptionDate: team.subscription?.nextSubscriptionDate || new Date(),
				adminFee: team.subscription?.adminFee || 0,
				memberFee: team.subscription?.memberFee || 0,
				currentProRatedFee: team.subscription?.currentProRatedFee || 0
			}

			// Update team document
			team.members = newMembers
			team.subscription = newSubscription
			await team.save()
		}

		console.log('All teams updated successfully.')
		mongoose.disconnect()
	} catch (error) {
		console.error('Error updating teams:', error)
		mongoose.disconnect()
	}
}