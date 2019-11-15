#!/usr/bin/env node

global.__base = __dirname
const rabbitmq = require('./config/rabbitmq')
const amqp = require('amqplib/callback_api')

amqp.connect(rabbitmq.options.server, function (error0, connection) {
  if (error0) {
    throw error0
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1
    }

    const queue = rabbitmq.options.queue
    const backupQueue = rabbitmq.options.backupQueue
    const mainExchange = rabbitmq.options.mainExchange
    const backupExchange = rabbitmq.options.backupExchange
    const acceptablyLag = rabbitmq.options.acceptablyLag


    channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': backupExchange,
        'x-message-ttl': 15000,
      }
    })

    channel.assertExchange(mainExchange, 'direct');
    channel.assertExchange(backupExchange, 'fanout');


    channel.assertQueue(backupQueue, {
      durable: true
    })

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)

    channel.prefetch(1)
    channel.consume(backupQueue, function (msg) {
      const data = JSON.parse(msg.content.toString())
      let daysLag = 0
      if (typeof data.request !== "undefined" && typeof data.request.timestamp !== "undefined") {
        const dateCreated = new Date(data.request.timestamp);
        const dateNow = new Date();
         daysLag = Math.ceil(Math.abs(dateNow.getTime() - dateCreated.getTime()) / (1000 * 3600 * 24));
      }
      if (daysLag < acceptablyLag) {
        channel.sendToQueue(queue, Buffer.from(msg.content.toString()))
      }
      channel.ack(msg)
    }, {
      noAck: false
    })
  })
})