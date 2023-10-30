const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { Schema } = mongoose

const teamSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	members: [{
		type: Schema.Types.ObjectId,
		ref: 'User',
		unique: true
	}],
	invitations: [{
		type: Schema.Types.ObjectId,
		ref: 'TeamInvitation',
		unique: true
	}],
	admin: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}
})

teamSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		if(returnedObject._id){
			returnedObject.id = returnedObject._id.toString()
		}
		delete returnedObject._id
		delete returnedObject.__v
	}
})

teamSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Team', teamSchema)
