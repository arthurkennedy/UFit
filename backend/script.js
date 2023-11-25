const mongoose = require('mongoose')
const User = require('./models/user')
const config = require('./utils/config')
const logger = require('./utils/logger')
// Update with the correct path to your User model

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message)
	})

const updateUsers = async () => {
	try {
		await User.updateMany(
			{},
			{
				$set: {
					participation_points: 0,
					ufit_points: 0,
					lastPostDate: null,
					lastReplyDate: null,
					currentStreak: 0,
					longestStreak: 0
				}
			},
			{ upsert: true }
		)

		console.log('All users updated successfully.')
		mongoose.disconnect()
	} catch (error) {
		console.error('Error updating users:', error)
		mongoose.disconnect()
	}
}

updateUsers()
