const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
	request: String,
	session: String,
	actor: String,
	actorType: String,
	actorAlias: String,
	eventType: String,
	entity: String,
	entityId: String,
	entityProperties: [
		new mongoose.Schema({
			_id: mongoose.Schema.Types.ObjectId,
			propertyEntity: String,
			propertyId: String,
			propertyName: String,
			oldValue: String,
			newValue: String,
		})],
	created: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Event', eventSchema)
