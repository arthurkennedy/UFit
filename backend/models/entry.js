const mongoose = require('mongoose')
const { Schema } = mongoose

const entrySchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	content: {
		type: String,
		required: true
	},
	likes: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	},
	replies: [{
		type: Schema.Types.ObjectId,
		ref: 'Entry'
	}],
	isTopLevel: {
		type: Boolean,
		default: true
	}
})

const Entry = mongoose.model('Entry', entrySchema)
module.exports = Entry
