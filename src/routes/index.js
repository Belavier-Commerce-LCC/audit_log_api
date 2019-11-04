// Import our Controllers
const eventController = require(`${__base}/controllers/event_controller`)
const documentation = require('./documentation/event_api')


const routes = [
	{
		method: 'GET',
		url: '/api/events/:domain',
		handler: eventController.getEvents,
		schema: documentation.getEventsSchema
	},
	{
		method: 'GET',
		url: '/api/field_values/:domain/:field',
		handler: eventController.getFieldValues,
		schema: documentation.getFieldValuesSchema
	},
	{
		method: 'GET',
		url: '/api/event/:domain/:id',
		handler: eventController.getSingleEvent,
		schema: documentation.getEventSchema
	},
	{
		method: 'POST',
		url: '/api/event/:domain',
		handler: eventController.addEvent,
		schema: documentation.addEventSchema
	},
	{
		method: 'GET',
		url: '/',
		handler: async (request, reply) => {
			reply.redirect('/documentation')
		},
		schema: documentation.rootPathSchema
	}
]

module.exports = routes