const User = require('../models/user')

const initialUsers = [
	{
		'username': 'test_user',
		'password': 'test',
		'first_name': 'testerson',
		'last_name': 'mctest',
		'email': 'mctest@gmail.com',
		'age': 1,
		'gender': 'Male',
		'weight': 175.3
	},
	{
		'username': 'test_user2',
		'password': 'test2',
		'first_name': 'testerson2',
		'last_name': 'mctest2',
		'email': 'mctest2@gmail.com',
		'age': 1,
		'gender': 'Female',
		'weight': 179.3
	}
]

module.exports = {
	initialUsers
}
