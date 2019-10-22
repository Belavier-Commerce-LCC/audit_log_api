//Connecting to ElasticSearch
const elasticSettings = require(`${__base}/config/elasticSearch`)
const { Client } = require('@elastic/elasticsearch')
const elasticClient = new Client(elasticSettings.options)
const elasticController = require('./elasticSearchController')

// External Dependancies
const boom = require('boom')

// Get Data Models
const Event = require(`${__base}/models/Event`)

// Get all cars
exports.getEvents = async (req, reply) => {
  try {
    const { body } = await elasticClient.search({
      index: elasticSettings.request_options.index,
      body: req.body
    })
    return body
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.getFieldValues = async (req, reply) => {
  try {
    const { body } = await elasticClient.search({
      index: elasticSettings.request_options.index,
      body: {
        'aggs': {
          'fieldValues': {
            'terms': {
              'field': req.params.field + '.keyword'
            }
          }
        }
      }
    })
    let result = []
    const relatedNames = body.aggregations.fieldValues.buckets
    relatedNames.forEach((el) => {
      result.push(el.key)
    })

    return result
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Get single event by ID
exports.getSingleEvent = async (req, reply) => {
  try {
    const id = req.params.id

		const { body } = await elasticClient.search({
      index: elasticSettings.request_options.index,
      body: {
        'query': {
          'term': {
            'id': id
          }
        }
      }
    })

    return body
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Add a new event
exports.addEvent = async function (req, reply) {
  try {
    reply.type('application/json').code(204)
    return await elasticController.save(req.body)
  } catch (err) {
    reply.type('application/json').code(503)
    throw boom.boomify(err)
  }
}



/*
// Add a new event
exports.addEvent = function (req, reply) {
	try {
		elasticClient.index({
			index: elasticSettings.request_options.index,
			body: req.body
		}, (err, body) => {
			if (!err) {
				reply.type('application/json').code(200)
				reply.send({
					result: body.body.result,
					_id: body.body._id
				})
				return
			} else {
				boom.boomify(err)
			}
		})
	} catch (err) {
		throw boom.boomify(err)
	}
}

exports.testConnection = async function (req, reply) {
	try {
		const {body} = await elasticClient.ping()
		return body
	} catch (err) {
		throw boom.boomify(err)
	}
}

// Update an existing event
exports.updateEvent = async (req, reply) => {
	try {
		const id = req.params.id
		const event = req.body
		const {...updateData} = event
		const update = await Event.findByIdAndUpdate(id, updateData, {new: true})
		return update
	} catch (err) {
		throw boom.boomify(err)
	}
}

// Delete a event
exports.deleteEvent = async (req, reply) => {
	try {
		const id = req.params.id
		const event = await Event.findByIdAndRemove(id)
		return event
	} catch (err) {
		throw boom.boomify(err)
	}
}

// find events
exports.findEvents = async (req, reply) => {
	try {
		const events = await Event.find(req.body)
		return events
	} catch (err) {
		throw boom.boomify(err)
	}
}
 */