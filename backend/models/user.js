const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	passwordHash: {
		type: String,
		required: true,
		unique: true
	},
	firstname: String,
	lastname: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	age: { type: Number, min: 1, max: 122 },
	gender: {
		type: String,
		enum: ['Male', 'Female', 'Other']
	},
	weight: Number,
	height: Number,
	created_at: { type: Date, default: Date.now() },
	updated_at: { type: Date, default: Date.now() }
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)