#!/usr/bin/env node

global.__base = __dirname
const rabbitmq = require('./config/rabbitmq')
const apiClient = require('./controllers/apiClient')
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
    channel.consume(queue, function (msg) {

      apiClient.save(JSON.parse(msg.content.toString()))
        .then((response) => {
          if (response.status === 200) {
            channel.ack(msg)
            //console.log('Saved')
          } else {
            channel.reject(msg)
          }
        })
        .catch(
          (error) => {
            channel.reject(msg)
          }
        )

    }, {
      noAck: false
    })
  })
})