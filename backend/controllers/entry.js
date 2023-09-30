const jwt = require('jsonwebtoken')
const entryRouter = require('express').Router()
const User = require('../models/user')
const Entry = require('../models/entry')

const parseToken = request => {
	const authorization = request.get('authorization')
	if(authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '')
	}
	return null
}

entryRouter.post('/', async (request, response) => {
	const body = request.body
	const decodedToken = jwt.verify(parseToken(request), process.env.SECRET)

	if(!decodedToken.id) {
		return response.status(401).json({ error: 'invalid authorization token' })
	}

	const user = await User.findById(decodedToken.id)

	const entry = new Entry({
		content: body.content,
		user: user._id
	})

	const savedEntry = await entry.save()
	response.json(savedEntry)
})

module.exports = entryRouter