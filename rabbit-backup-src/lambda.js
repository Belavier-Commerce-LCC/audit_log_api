global.__base = __dirname
const rabbitmq = require('./config/rabbitmq')
const processMessage = require('./processMessage')
const amqp = require('amqplib')

const EventEmitter = require('events')
const eventEmitter = new EventEmitter()
const timeout = 10000


exports.handler =  async (event) => {
  let conn = await amqp.connect(rabbitmq.options.server)
  let channel = await conn.createChannel()
  const queue = rabbitmq.options.queue
  const backupQueue = rabbitmq.options.backupQueue
  const mainExchange = rabbitmq.options.mainExchange
  const backupExchange = rabbitmq.options.backupExchange
  const acceptablyLag = rabbitmq.options.acceptablyLag
  await channel.assertQueue(queue, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': backupExchange,
      'x-message-ttl': 15000,
    }
  })

  await channel.assertExchange(mainExchange, 'direct')
  await channel.assertExchange(backupExchange, 'fanout')

  let response = await channel.assertQueue(backupQueue, {
    durable: true
  })
  let messageCount = response.messageCount
  response = await channel.consume(response.queue, moveMessage(messageCount, channel, queue), {noAck: false})
  /**
   * {noAck: false} false for not expect an acknowledgement
   */

  /**
   * declare timeout if we have problems with emit event in consume
   * we wait when event will emit once 'consumeDone' and promise gain resolve
   * we can go to the next step
   */
  setTimeout(() => eventEmitter.emit('consumeDone'), timeout)
  await new Promise(resolve => eventEmitter.once('consumeDone', resolve))
  console.log('reading for query finish')
  return {
    status: 200,
  }

  function moveMessage(messageCount, channel, queue) {
    return msg => {
      processMessage(msg, channel, queue)
      if (messageCount == msg.fields.deliveryTag) {
        eventEmitter.emit('consumeDone')
      }
    }

  }

}