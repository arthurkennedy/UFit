function isConsecutiveDay(date1, date2) {
	// Create new date objects for comparison
	const day1 = new Date(date1.getTime())
	day1.setHours(0, 0, 0, 0)

	const day2 = new Date(date2.getTime())
	day2.setHours(0, 0, 0, 0)

	const diff = day2 - day1
	const oneDay = 24 * 60 * 60 * 1000
	return diff === oneDay
}


function getLastActivityDate(user) {
	const postDate = user.lastPostDate || new Date(0) // Fallback to a very old date if null
	const replyDate = user.lastReplyDate || new Date(0) // Fallback to a very old date if null
	return postDate > replyDate ? postDate : replyDate // Correct comparison
}

const updateUserParticipation = async (user, isReply = false) => {
	const currentDate = new Date()
	currentDate.setHours(0, 0, 0, 0)
	const lastActivityDate = getLastActivityDate(user)

	if (!lastActivityDate || !isConsecutiveDay(lastActivityDate, currentDate)) {
		user.currentStreak = 1
	} else {
		user.currentStreak += 1
	}

	if (user.currentStreak > user.longestStreak) {
		user.longestStreak = user.currentStreak
	}

	if (isReply) {
		if (!user.lastReplyDate || user.lastReplyDate < currentDate) {
			user.lastReplyDate = currentDate
			user.participation_points += 1
		}
	} else {
		if (!user.lastPostDate || user.lastPostDate < currentDate) {
			user.lastPostDate = currentDate
			user.participation_points += 1
		}
	}

	await user.save()
}


module.exports = { updateUserParticipation, getLastActivityDate }