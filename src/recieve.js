#!/usr/bin/env node
const rabbitmq = require('./config/rabbitmq')
var amqp = require('amqplib/callback_api');

amqp.connect(rabbitmq.options.server, function(error0, connection) {
	if (error0) {
		throw error0;
	}
	connection.createChannel(function(error1, channel) {
		if (error1) {
			throw error1;
		}

		const queue = rabbitmq.options.queue

		channel.assertQueue(queue, {
			durable: false
		});

		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

		channel.consume(queue, function(msg) {
			request = msg.content.toString()

			console.log(JSON.parse(request));
		}, {
			noAck: true
		});
	});
});