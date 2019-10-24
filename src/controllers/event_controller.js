// External Dependancies
const boom = require('boom')


// Get all events
exports.getEvents = async (req, reply) => {
  try {
  return await storageDriver.find(req)
  } catch (err) {
    throw boom.boomify(err)
  }
}

//Get Field unique values
exports.getFieldValues = async (req, reply) => {
  try {
    return await storageDriver.getFieldValues(req.params.field)
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Get single event by ID
exports.getSingleEvent = async (req, reply) => {
  try {
    const id = req.params.id
    return await storageDriver.read(id)
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Add a new event
exports.addEvent = async function (req, reply) {
  try {
    const createResult =  await storageDriver.create(req.body)
    if (createResult.body.result === 'created' || createResult.body.result === 'updated') {
      return await storageDriver.read(req.body.id)
    } else {
      reply.type('application/json').code(400)
      return createResult
    }
  } catch (err) {
    throw boom.boomify(err)
  }
}
