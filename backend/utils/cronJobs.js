const cron = require('node-cron')
const User = require('../models/user')
const Team = require('../models/team')
const { getLastActivityDate, distributePoints, setNextDistributionDate, calculateProRatedSubscriptionFee } = require('./participationUtils')

const resetUserStreaks = async () => {
	const currentDate = new Date()
	currentDate.setHours(0, 0, 0, 0)

	const users = await User.find({})
	for (const user of users) {
		const lastActivityDate = getLastActivityDate(user)
		if (!lastActivityDate || lastActivityDate < currentDate) {
			user.currentStreak = 0
			try {
				await user.save()
			} catch (error) {
				console.error('Error resetting streak for user:', user.id, error)
			}
		}
	}
}

const runNightlyDistribution = async () => {
	try {
		const teams = await Team.find({}).populate('admin').populate({ path: 'members.user', model: 'User' })
		for (const team of teams) {
			team.subscription.nextDistributionDate.setHours(0, 0, 0, 0)
			const currentDate = new Date()
			currentDate.setHours(0,0,0,0)
			if(team.subscription.type === 'HYBRID' || team.subscription.type === 'MEMBER') {
				const proRatedFee = calculateProRatedSubscriptionFee(currentDate, team.subscription.schedule, team.subscription.fee)
				team.subscription.currentProRatedFee = proRatedFee
				await team.save()
			}
			if (team.subscription.nextDistributionDate <= currentDate) {
				await distributePoints(team)
				setNextDistributionDate(team)
				await team.save()
			}
		}
	} catch (error) {
		console.error('Error in nightly distribution: ', error)
	}
}

const setupCronJobs = () => {
	cron.schedule('0 0 * * *', resetUserStreaks, {
		scheduled: true,
		timezone: 'America/Chicago'
	})
	cron.schedule('0 0 * * *', runNightlyDistribution, {
		scheduled: true,
		timezone: 'America/Chicago'
	})
}

module.exports = { setupCronJobs, resetUserStreaks, runNightlyDistribution }