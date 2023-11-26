const entryRouter = require('express').Router()
const Entry = require('../models/entry')
const User = require('../models/user')
const Team = require('../models/team')
const { authenticate } = require('../utils/middleware')
const { updateUserParticipation } = require('../utils/participationUtils')


entryRouter.post('/', authenticate, async (request, response) => {
	console.log.og(1);
	const user = await User.findById(request.user.id)

	const entry = new Entry({
		content: request.body.content,
		user: user._id
	})

	await updateUserParticipation(user, false)
	const savedEntry = await entry.save()
	const responseObject = {
		...savedEntry._doc,
		user: { username: user.username, id: user.id, participation_points: user.participation_points }
	}


	response.status(200).json(responseObject)
})

entryRouter.get('/', authenticate, async (request, response) => {
	const user = await User.findById(request.user.id).populate('teams')

	const teamMemberIds = user.teams.reduce((acc, team) => {
		const allMembers = [...team.members, team.admin]
		return acc.concat(allMembers)
	}, [])

	const entries = await Entry
		.find({
			$or: [{ 'user': { $in: teamMemberIds } }]
		})
		.sort({ createdAt: -1 })
		.populate('user', 'username picture')

		console.log(entries);

		
	return response.status(200).json(entries)
})

entryRouter.get('/team', authenticate, async (request, response) => {
	const { teamId } = request.query

	const user = await User.findById(request.user.id)

	const team = await Team.findById(teamId).populate('members').populate('admin')

	if(!team) {
		return response.status(404).json({ error: 'team not found' })
	}

	const teamMemberIds = [...team.members, team.admin]

	if(!teamMemberIds.includes(user._id)) {
		return response.status(405).json({ error: 'user not authorized' })
	}

	const entries = await Entry
		.find({
			$or: [{ 'user': { $in: teamMemberIds } }]
		})
		.sort({ createdAt: -1 })
		.populate('user', 'username')

	return response.status(200).json(entries)

})


entryRouter.post('/reply', async (request, response) => {
	//id of entry
	//content, user, isTopLevel =false
	const {id, content, user } = request.body;
	console.log(2,request.body);

	const newReply = new Entry({ content: content, user: user });

	const result = await Entry.findByIdAndUpdate(id,{
		$push: {replies: newReply}
	})

	response.json(result);
});


module.exports = entryRouter