const jwt = require('jsonwebtoken')
const parseToken = request => {
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		const token = authorization.replace('Bearer ', '')
		return jwt.verify(token, process.env.SECRET)
	}
	return null
}

module.exports = {
	parseToken
}