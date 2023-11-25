const isConsecutiveDay = (date1, date2) => {
	const diff = date2 - date1
	const oneDay = 24*60*60*1000 // milliseconds in one day
	return diff <= oneDay && diff > 0
}

const updateUserParticipation = async (user, isReply=false) => {
	const currentDate = new Date()
	currentDate.setHours(0,0,0,0)

	const lastActivityDate = user.lastPostDate > user.lastReplyDate ? user.lastPostDate : user.lastReplyDate

	if(!lastActivityDate || !isConsecutiveDay(lastActivityDate, currentDate)) {
		user.currentStreak = 1
	} else {
		user.currentStreak += 1
	}

	if(user.currentStreak > user.longestStreak) {
		user.longestStreak = user.currentStreak
	}

	// Update Participation points
	if(isReply) {
		const isFirstReplyToday = !user.lastReplyDate || user.lastReplyDate < currentDate
		if(isFirstReplyToday) {
			user.lastReplyDate = currentDate
			user.participation_points += 1
		} else {
			const isFirstPostToday = !user.lastPostDate || user.lastPostDate < currentDate
			if(isFirstPostToday) {
				user.lastPostDate = currentDate
				user.participation_points += 1
			}
		}
	}

	await user.save()
}

module.exports = { updateUserParticipation }