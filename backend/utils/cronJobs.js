const cron = require('node-cron')
const User = require('../models/user')
const Team = require('../models/team')
const { getLastActivityDate, distributePoints, setNextDistributionDate, calculateProRatedSubscriptionFee,
	setNextSubscriptionDate, convertMoneyToUfitPoints, calculateNumberOfDistributionPeriods
} = require('./participationUtils')

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
			team.subscription.nextSubscriptionDate.setHours(0, 0, 0, 0)
			const currentDate = new Date()
			currentDate.setHours(0,0,0,0)
			if(team.subscription.type === 'HYBRID' || team.subscription.type === 'MEMBER') {
				const proRatedFee = calculateProRatedSubscriptionFee(currentDate, team.subscription.schedule, team.subscription.adminFee + team.subscription.memberFee)
				team.subscription.currentProRatedFee = proRatedFee
				await team.save()
			}
			if (team.subscription.nextDistributionDate.getTime() <= currentDate.getTime()) {
				// console.log('DISTRIBUTE ACTIVATED')
				await distributePoints(team)
				setNextDistributionDate(team)
			}
			if (team.subscription.nextSubscriptionDate.getTime() <= currentDate.getTime()) {
				// console.log('SUSCRIPTION ACTIVATED')
				setNextSubscriptionDate(team)
				if(team.subscription.type !== 'FREE') {
					const pointPool = team.subscription.pointPool + convertMoneyToUfitPoints(team.subscription.memberFee + team.subscription.adminFee)
					team.subscription.pointPool = pointPool
					team.subscription.pointsPerDistribution = pointPool / calculateNumberOfDistributionPeriods(team.subscription.schedule, team.subscription.distributionSchedule)
				}
			}
			// console.log(team)
			await team.save()
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