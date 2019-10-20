// Import our Controllers
const eventController = require(`${__base}/controllers/EventController`)
const documentation = require('./documentation/eventApi')


const routes = [
	{
		method: 'POST',
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
	/*
	{
		method: 'POST',
		url: '/api/event',
		handler: eventController.addEvent,
		schema: documentation.addEventSchema
	},
	{
		method: 'PUT',
		url: '/api/event/:id',
		handler: eventController.updateEvent,
		schema: documentation.putEventSchema
	},
	{
		method: 'DELETE',
		url: '/api/event/:id',
		handler: eventController.deleteEvent,
		schema: documentation.delEventSchema
	},
	{
		method: 'GET',
		url: '/api/test',
		handler: eventController.testConnection
	},*/
]

module.exports = routes