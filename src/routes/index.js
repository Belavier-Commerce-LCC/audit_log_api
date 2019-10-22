// Import our Controllers
const eventController = require(`${__base}/controllers/EventController`)
const documentation = require('./documentation/eventApi')


const routes = [
	{
		method: 'GET',
		url: '/api/events',
		handler: eventController.getEvents,
		schema: documentation.getEventsSchema
	},
	{
		method: 'GET',
		url: '/api/field_values/:field',
		handler: eventController.getFieldValues,
		schema: documentation.getFieldValuesSchema
	},
	{
		method: 'GET',
		url: '/api/event/:id',
		handler: eventController.getSingleEvent,
		schema: documentation.getEventSchema
	},
	{
		method: 'POST',
		url: '/api/event',
		handler: eventController.addEvent,
		schema: documentation.addEventSchema
	},
]

module.exports = routes