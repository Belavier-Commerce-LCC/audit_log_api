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

    channel.assertQueue(queue, {
      durable: false
    })

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)

    channel.prefetch(1)
    channel.consume(queue, function (msg) {

      apiClient.save(JSON.parse(msg.content.toString()))
        .then((response) => {
          if (response.status === 200) {
            console.log('Saved')
            channel.ack(msg)
          } else {
            console.log(response.status)
            console.log(response.statusText)
          }
        })
        .catch(
          (error) => {
            console.log(error)
          }
        )

    }, {
      noAck: false
    })
  })
})