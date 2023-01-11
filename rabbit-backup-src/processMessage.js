exports = (msg, channel, queue) => {
  const data = JSON.parse(msg.content.toString())
  let daysLag = 0

  if (typeof data.domain === 'undefined') {
    channel.ack(msg)
  } else {

    if (typeof data.request !== 'undefined' && typeof data.request.timestamp !== 'undefined') {
      const dateCreated = new Date(data.request.timestamp)
      const dateNow = new Date()
      daysLag = Math.ceil(Math.abs(dateNow.getTime() - dateCreated.getTime()) / (1000 * 3600 * 24))
    }

    if (daysLag < acceptablyLag) {
      channel.sendToQueue(queue, Buffer.from(msg.content.toString()))
    }
    channel.ack(msg)
  }
}