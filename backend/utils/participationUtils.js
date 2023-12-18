const User = require('../models/user')

const isConsecutiveDay = (date1, date2) => {
	// Create new date objects for comparison
	const day1 = new Date(date1.getTime())
	day1.setHours(0, 0, 0, 0)

	const day2 = new Date(date2.getTime())
	day2.setHours(0, 0, 0, 0)

	const diff = day2 - day1
	const oneDay = 24 * 60 * 60 * 1000
	return diff === oneDay
}


const getLastActivityDate = (user) => {
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

const calculateNumberOfDistributionPeriods = (subscriptionSchedule, distributionSchedule) => {
	const currentDate = new Date()
	currentDate.setHours(0,0,0,0)
	const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

	switch (subscriptionSchedule) {
	case 'MONTHLY':
		return distributionSchedule === 'DAILY' ? daysInMonth :
			(distributionSchedule === 'WEEKLY' ? Math.floor(daysInMonth / 7) : 1)

	case 'WEEKLY':
		return distributionSchedule === 'DAILY' ? 7 : 1

	case 'DAILY':
		return 1

	default:
		return 1
	}
}


const calculateProRatedSubscriptionFee = (userJoinDate, subscriptionSchedule, subscriptionFee) => {
	const currentDate = new Date()
	currentDate.setHours(0, 0, 0, 0)

	// Ensure userJoinDate is a Date object and set to start of the day
	const joinDate = new Date(userJoinDate)
	joinDate.setHours(0, 0, 0, 0)

	if (joinDate > currentDate) {
		console.log('Join date is in the future. No subscription fee charged.')
		return 0
	}

	let totalDaysInCycle
	let daysRemainingInCycle

	switch (subscriptionSchedule) {
	case 'MONTHLY':
		const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
		totalDaysInCycle = daysInMonth
		daysRemainingInCycle = daysInMonth - Math.ceil((currentDate - joinDate) / (1000 * 60 * 60 * 24))
		break
	case 'WEEKLY':
		totalDaysInCycle = 7
		daysRemainingInCycle = 7 - Math.ceil((currentDate - joinDate) / (1000 * 60 * 60 * 24))
		break
	case 'DAILY':
		totalDaysInCycle = 1
		daysRemainingInCycle = 1
		break
	default:
		console.log('Invalid subscription schedule')
		return 0
	}

	const proRatedFee = (subscriptionFee / totalDaysInCycle) * daysRemainingInCycle
	return proRatedFee
}


const distributePoints = async (team) => {

	let totalParticipationPoints = team.members.reduce((sum, member) => sum + member.user.participation_points, 0)

	if(totalParticipationPoints === 0) {
		totalParticipationPoints = team.members.length // Account for admin
		for (const member of team.members) {
			member.user.participation_points = 1
		}
	}

	for (const member of team.members) {
		await processUserPoints(member, totalParticipationPoints, team.subscription.pointsPerDistribution)
	}
	team.subscription.pointPool -= team.subscription.pointsPerDistribution
}

const processUserPoints = async (member, totalParticipationPoints, pointPool) => {
	const user = member.user
	const userShare = user.participation_points / totalParticipationPoints
	const pointsEarned = userShare * pointPool

	user.ufit_points += pointsEarned
	user.participation_points = 0
	member.pointsEarnedLastDistribution = pointsEarned
	member.totalPointsEarned += pointsEarned

	await user.save()
}

const calculateDaysTillNextScheduledDate = (schedule) => {
	const currentDate = new Date()
	currentDate.setHours(0, 0, 0, 0)

	switch (schedule) {
	case 'DAILY':
		return 1 // Next day
	case 'WEEKLY':
		return 7 // Days until the end of the week
	case 'MONTHLY':
		return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
	default:
		return 1 // Default to next day if invalid
	}
}

const setNextDistributionDate = (team) => {
	const daysTillNextDistribution = calculateDaysTillNextScheduledDate(team.subscription.distributionSchedule)
	const nextDate = new Date()
	nextDate.setHours(0, 0, 0, 0)
	nextDate.setDate(nextDate.getDate() + daysTillNextDistribution)
	team.subscription.nextDistributionDate = nextDate
}

const setNextSubscriptionDate = (team) => {
	const daysTillNextSubscription = calculateDaysTillNextScheduledDate(team.subscription.schedule)
	const nextSubscriptionDate = new Date()
	nextSubscriptionDate.setHours(0, 0, 0, 0)
	nextSubscriptionDate.setDate(nextSubscriptionDate.getDate() + daysTillNextSubscription)
	team.subscription.nextSubscriptionDate = nextSubscriptionDate
}

const setNextDates = (team) => {
	setNextDistributionDate(team)
	setNextSubscriptionDate(team)
}

const convertMoneyToUfitPoints = (money) => {
	return money * 122
}


module.exports = {
	calculateNumberOfDistributionPeriods,
	convertMoneyToUfitPoints,
	updateUserParticipation,
	getLastActivityDate, distributePoints,
	setNextDates,
	setNextDistributionDate,
	setNextSubscriptionDate,
	calculateProRatedSubscriptionFee
}