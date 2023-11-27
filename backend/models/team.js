const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { Schema } = mongoose

const ScheduleEnum = ['DAILY', 'WEEKLY', 'MONTHLY']
const SubscriptionTypeEnum = ['BENEFACTOR', 'MEMBER', 'FREE', 'HYBRID']

const subscriptionSchema = new Schema({
	schedule: {
		type: String,
		enum: ScheduleEnum,
		default: 'MONTHLY'
	},
	distributionSchedule: {
		type: String,
		enum: ScheduleEnum,
		default: 'WEEKLY'
	},
	type: {
		type: String,
		enum: SubscriptionTypeEnum,
		default: 'FREE'
	},
	pointPool: {
		type: Number,
		default: 0
	},
	pointsPerDistribution: {
		type: Number,
		default: 0
	},
	nextDistributionDate: Date,
	fee: {
		type: Number,
		default: 0
	},
	currentProRatedFee: {
		type: Number,
		default: 0
	}
})

const teamMemberSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	pointsEarnedLastDistribution: {
		type: Number,
		default: 0
	},
	totalPointsEarned: {
		type: Number,
		default: 0
	}
})

const teamSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	members: [teamMemberSchema],
	invitations: [{
		type: Schema.Types.ObjectId,
		ref: 'TeamInvitation',
	}],
	admin: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	subscription: subscriptionSchema
})

teamSchema.set('toJSON', {
	transform: (document, returnedObject) => {

		//Convert object id to string.
		if(!returnedObject.id) {
			returnedObject.id = returnedObject._id.toString()
		}

		delete returnedObject._id
		delete returnedObject.__v
	}
})

teamSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Team', teamSchema)
