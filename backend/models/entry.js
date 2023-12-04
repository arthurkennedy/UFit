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

entrySchema.set('toJSON', {
	transform: (document, returnedObject) => {

		//Convert object id to string.
		if(!returnedObject.id) {
			returnedObject.id = returnedObject._id.toString()
		}

		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Entry = mongoose.model('Entry', entrySchema)
module.exports = Entry
