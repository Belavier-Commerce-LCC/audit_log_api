#!/usr/bin/env node
const rabbitmq = require('./config/rabbitmq')
var amqp = require('amqplib/callback_api');

amqp.connect(rabbitmq.options.server, function (error0, connection) {
	if (error0) {
		throw error0;
	}
	connection.createChannel(function (error1, channel) {
		if (error1) {
			throw error1;
		}

		var queue = rabbitmq.options.queue;
		var msg = JSON.stringify(
			{
				event: {
					type: 'object',
					properties: {
						id: {type: 'string'},     // Unique eventid for grouping
						name: {type: 'string'},   // Update Customer Address
						group: {type: 'string'},  // Update Customer Address
						action: {type: 'string'},       // update
						oldValue: {type: 'string'},     // 141207  - some original value
						newValue: {type: 'string'},     // 141205 - some changed value
						ip: {type: 'string'},    // Source IP address
						description: {type: 'string'},   	// Message with result
						created: {type: 'string'},      // Date of event
					}
				}
			});

		channel.assertQueue(queue, {
			durable: false
		});

		channel.sendToQueue(queue, Buffer.from(msg));
		console.log(" [x] Sent %s", msg);

	});
	setTimeout(function () {
		connection.close();
		process.exit(0);
	}, 500);
});