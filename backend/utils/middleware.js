const logger = require('./logger')
const path = require('path')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
	logger.info('Method: ', request.method)
	logger.info('Path: ', request.path)
	logger.info('Body: ', request.body)
	logger.info('---')
	next()
}

const authenticate = (request, response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		const token = authorization.substring(7) // Same as replace('Bearer ', '')
		try {
			// attach the user information to the request
			request.user = jwt.verify(token, process.env.SECRET)
		} catch (error) {
			return response.status(401).json({ error: 'Token is invalid or expired' })
		}
	} else {
		return response.status(401).json({ error: 'Token missing or invalid' })
	}
	next()
}

const unknownEndpoint = (request, response) => {
	//response.status(404).send({ error: 'unknown endpoint' })
	response.sendFile(path.join(__dirname, '../dist', 'index.html'))
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)

	switch(error.name) {
	case 'CastError': return response.status(400).send({ error: 'malformatted id' })
	case 'ValidationError': return response.status(400).json({ error: error.message })
	}
	next(error)
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	authenticate
}
