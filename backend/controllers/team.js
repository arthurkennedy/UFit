const Team = require('../models/team')
const User = require('../models/user')
const { authenticate } = require('../utils/middleware')
const { convertMoneyToUfitPoints, calculateNumberOfDistributionPeriods, setNextDates } = require('../utils/participationUtils')
const teamRouter = require('express').Router()

teamRouter.post('/', authenticate, async (request, response) => {
	const admin = await User.findById(request.user.id)

	const { name, subscriptionDetails } = request.body

	const scheduleHierarchy = { 'DAILY': 1, 'WEEKLY': 2, 'MONTHLY': 3 }

	const isValidSchedule = scheduleHierarchy[subscriptionDetails.schedule] >= scheduleHierarchy[subscriptionDetails.distributionSchedule]

	if(!isValidSchedule) {
		return response.status(400).json({ error: 'Subscription schedule must be less frequent than or equal to distribution schedule' })
	}
	const team = new Team({
		name: name,
		members: [],
		invitations: [],
		admin: admin._id
	})
	if (subscriptionDetails.type !== 'FREE') {
		const pointPool = convertMoneyToUfitPoints(subscriptionDetails.memberFee + subscriptionDetails.adminFee)
		team.subscription = {
			...subscriptionDetails,
			pointPool: pointPool, // Process admin payment as member
			pointsPerDistribution: pointPool / calculateNumberOfDistributionPeriods(subscriptionDetails.schedule, subscriptionDetails.distributionSchedule)
		}
		setNextDates(team)
	}

	const savedTeam = await team.save()
	admin.teams = admin.teams.concat(savedTeam._id)
	await admin.save()
	response.status(200).json(savedTeam)
})

module.exports = teamRouter
