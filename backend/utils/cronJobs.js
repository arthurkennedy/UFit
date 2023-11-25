const cron = require('node-cron')
const User = require('../models/user')
const { getLastActivityDate } = require('./participationUtils')

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
const setupCronJobs = () => {
	cron.schedule('0 0 * * *', resetUserStreaks, {
		scheduled: true,
		timezone: 'America/Chicago'
	})
}

module.exports = { setupCronJobs, resetUserStreaks }