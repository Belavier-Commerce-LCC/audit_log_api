// External Dependancies
const boom = require('boom')

// Get all events
exports.getEvents = async (req, reply) => {
  try {
    const domain = req.params.domain
    return await storageDriver.find(domain, req)
  } catch (err) {
    throw boom.boomify(err)
  }
}

//Get Field unique values
exports.getFieldValues = async (req, reply) => {
  try {
    const domain = req.params.domain
    return await storageDriver.getFieldValues(domain, req.params.field)
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Get single event by ID
exports.getSingleEvent = async (req, reply) => {
  try {
    const id = req.params.id
    const domain = req.params.domain
    return await storageDriver.read(domain, id)
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Add a new event
exports.addEvent = async function (req, reply) {
  try {
    const domain = req.params.domain
    const createResult = await storageDriver.create(domain, req.body)
    if (createResult.body.result === 'created' || createResult.body.result === 'updated') {
      //console.log(createResult)
      return await storageDriver.read(domain, createResult.body._id)
    } else {
      reply.type('application/json').code(400)
      return createResult
    }
  } catch (err) {
    throw boom.boomify(err)
  }
}
