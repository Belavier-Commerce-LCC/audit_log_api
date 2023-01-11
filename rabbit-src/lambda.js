global.__base = __dirname
const rabbitmq = require('./config/rabbitmq')
const apiClient = require('./controllers/apiClient')
const queue = rabbitmq.options.queue

exports.handler =  async (event) => {
  console.log('Event: ', JSON.stringify(event))
  let messages = event.rmqMessagesByQueue[`${queue}::/`]
  let countSuccess = 0
  for (let message of messages) {
    let buff = Buffer.from(message.data, 'base64')
    let payload = JSON.parse(buff.toString())

    try {
      let response = await apiClient.save(payload)
      if (response.status === 200) {
        countSuccess++
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (countSuccess < messages.length) {
    return {
      status: 500,
      data: 'Some messages not saved to ElasticSearch'
    }
  }

  return {
    status: 200,
  }
}