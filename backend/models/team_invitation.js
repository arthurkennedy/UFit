const mongoose = require('mongoose')
const { Schema } = mongoose

const teamInvitationSchema = new mongoose.Schema({
	team: {
		type: Schema.Types.ObjectId,
		ref: 'Team'
	},
	invitee: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	state: {
		type: String,
		enum: ['PENDING', 'REJECTED'],
		default: 'PENDING'
	}
})

teamInvitationSchema.index({ invitee: 1, team: 1 }, { unique: true })

teamInvitationSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('TeamInvitation', teamInvitationSchema)