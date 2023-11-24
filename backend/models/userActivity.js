const mongoose = require('mongoose')
const { Schema } = mongoose

const participationSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: true
	},
	lastActivityDate: Date,
	currentStreak: {
		type: Number,
		default: 0
	},
	longestStreak: {
		type:Number,
		default: 0
	}
})