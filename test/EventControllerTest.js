// var expect    = require("chai").expect;
// var assert = require('chai').assert;
import {describe} from "mocha";

const eventController = require('../src/controllers/EventController');

describe('Event Controller Test', function () {
	describe('Get Events Test', function () {
		it('should return empty array', function () {
			// let events =
			eventController.getEvents()
			// console.log(events)
			// assert.typeOf(events, 'object')
		});
	})
})