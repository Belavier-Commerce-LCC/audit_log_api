#!/usr/bin/env node
const rabbitmq = require('./config/rabbitmq')
const elasticSettings = require('./config/elasticSearch')
const {Client} = require('@elastic/elasticsearch')
const elasticClient = new Client(elasticSettings.options)
var amqp = require('amqplib/callback_api');

async function save (message) {
	message.request = {
		ip: '',
		timestamp: new Date().toISOString()
	}
	await elasticClient.index({
		index: elasticSettings.request_options.index,
		body: message
	})
	console.log('[+] Writed message to Audit Log')
}

async function save_error (message) {
	message.request = {
		ip: '',
		timestamp: new Date().toISOString()
	}
	await elasticClient.index({
		index: elasticSettings.request_options.error_index,
		body: message
	})
	console.log('[+] Error message to Audit Log')
}

amqp.connect(rabbitmq.options.server, function (error0, connection) {
	if (error0) {
		throw error0;
	}
	connection.createChannel(function (error1, channel) {
		if (error1) {
			throw error1;
		}

		const queue = rabbitmq.options.queue

		channel.assertQueue(queue, {
			durable: false
		});

		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

		channel.consume(queue, function (msg) {

			save(JSON.parse(msg.content.toString())).catch(save_error)

		}, {
			noAck: true
		});
	});
});