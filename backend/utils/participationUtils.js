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
	const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

	switch(subscriptionSchedule) {
	case 'MONTHLY':
		return distributionSchedule === 'DAILY' ? daysInMonth : (distributionSchedule === 'WEEKLY' ? Math.ceil(daysInMonth / 7) : 1)
	case 'WEEKLY':
		return distributionSchedule === 'DAILY' ? 7 : (distributionSchedule === 'WEEKLY' ? 1 : 1/4) // Assuming 4 weeks in a month
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
		+ team.admin.participation_points

	if(totalParticipationPoints === 0) {
		totalParticipationPoints = team.members.length() + 1 // Account for admin
	}

	await processUserPoints(team.admin, totalParticipationPoints, team.subscription.pointsPerDistribution )
	for (const member of team.members) {
		await processUserPoints(member.user, totalParticipationPoints, team.subscription.pointsPerDistribution)
	}
	team.subscription.pointPool -= team.subscription.pointsPerDistribution
}

const processUserPoints = async (user, totalParticipationPoints, pointPool) => {
	const userShare = user.participation_points / totalParticipationPoints
	const pointsEarned = userShare * pointPool

	user.ufit_points += pointsEarned
	user.participation_points = 0

	await user.save()
}

const setNextDistributionDate = (team) => {
	const periodDays = calculateNumberOfDistributionPeriods(team.subscription.schedule, team.subscription.distributionSchedule)
	const nextDate = new Date()
	nextDate.setHours(0,0,0,0)
	nextDate.setDate(nextDate.getDate() + periodDays)
	team.nextDistributionDate = nextDate
}



module.exports = { updateUserParticipation, getLastActivityDate, distributePoints, setNextDistributionDate, calculateProRatedSubscriptionFee }