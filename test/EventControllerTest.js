const describe = require('mocha').describe;

const eventController = require('../src/controllers/event_controller');

describe('Event Controller Test', function () {
	describe('Get Events Test', function () {
		it('should return empty array', function () {
			// let events =
			eventController.getEvents()
			// assert.typeOf(events, 'object')
		});
	})
})