#!/usr/bin/env node
const rabbitmq = require('./config/rabbitmq')
const elastic = require('./controllers/elasticSearchController')
const amqp = require('amqplib/callback_api');

elastic.elasticClient.ping((err => { //Check ElasticSearch connection
	if (err) {
		throw err
	}

	elastic.check_indices().then((result) => {
		if (result.statusCode != 200) {
			elastic.create_index().then(() => {
				elastic.set_mappings(elastic.mapping()).catch(console.log)
			})
		}
	})

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

				elastic.save(JSON.parse(msg.content.toString())).catch(elastic.save_error)

			}, {
				noAck: true
			});
		});
	});

}))