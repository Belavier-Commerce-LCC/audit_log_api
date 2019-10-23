const { Client } = require('@elastic/elasticsearch')
const elasticClient = new Client(conf.elasticSearch)

//Load on start server
exports.init = async () => {
  console.log('Init Storage')
  const checkResult = await _check_indices()
  if (!checkResult.body) {
    const createResult = await _create_index()
    if (createResult.statusCode === 200) {
      const setMappingResult = await _set_mappings(_mapping())
      if (setMappingResult.statusCode !== 200) {
        console.log(setMappingResult)
      }
    } else {
      console.log(createResult)
    }
  }
}

//Create new record
exports.create = async (data) => {
  data.request = {
    ip: '',
    timestamp: new Date().toISOString()
  }
  const queryObJ = {
    query: {
      bool: {
        must: [
          {
            term: {
              id: data.id
            }
          },
          {
            term: {
              'entity.id': data.entity.id
            }
          },
          {
            term: {
              'entity.name.keyword': data.entity.name
            }
          },
          {
            term: {
              'entity.group.keyword': data.entity.group
            }
          }
        ]
      }
    }
  }
  const exists = await elasticClient.search({
    index: conf.es_request_options.index,
    body: queryObJ
  })

  const recordCount = exists.body.hits.total.value

  if (recordCount === 0) {
    await elasticClient.index({
      index: conf.es_request_options.index,
      body: data
    })
    await elasticClient.indices.refresh({ index: elasticSettings.request_options.index })

    console.log('[+] Writed message to Audit Log')
  } else {
    const existRecords = exists.body.hits.hits
    let changes = existRecords[0]._source.changes
    data.changes.forEach((el) => {
      changes.push(el)
    })

    await elasticClient.update({
      index: conf.es_request_options.index,
      id: existRecords[0]._id,
      body: {
        doc: {
          changes: changes
        }
      }
    })
    console.log('[+] Updated message ${existRecords[0]._id} to Audit Log')
  }
}

//Get exist data
exports.read = async (id) => {
  const { body } = await elasticClient.search({
    index: conf.es_request_options.index,
    body: {
      'query': {
        'term': {
          'id': id
        }
      }
    }
  })
  return _prepareOutput(body)
}

//Get exist data
exports.find = async (params) => {
  /**
   * Limit displayed records
   * @type integer limit
   */
  let limit = params.query.limit || 10
  /**
   * Offset records
   * @type integer offset
   */
  const offset = params.query.offset || 0
  /**
   * Field name for sorting
   * @type string sort
   */
  const sort = params.query.sort
  /**
   * Order value for sorting
   * @type string order
   */
  const order = params.query.order || 'ASC'
  /**
   * Filter string
   * || = 'OR' operator
   *  : = equal operator
   *  , = 'AND' operator
   *  example: entity.name:Product,entity.id:300||entity.name:User
   *  description: Get fields where (entity.name=Product AND entity.id=300) OR (entity.name=User)
   * @type string filter
   */
  const filter = params.query.filter
  /**
   * Start date for filter by date range
   * @type string dateFrom
   */
  let dateFrom = params.query.dateFrom
  /**
   * End date for filter by date range
   * @type string dateTo
   */
  let dateTo = params.query.dateTo

  let requestBody = {}
  let query = {
    'query': {
      'bool': {
        'should': []
      }
    }
  }

  if (typeof filter !== 'undefined') {
    const orParts = filter.toString().split('||')
    orParts.forEach((orPart) => {
      let andParts = orPart.split(',')
      let subquery = {
        'bool': {
          'must': []
        }
      }
      andParts.forEach((andPart) => {
        let item = andPart.split(':')
        if (item.length === 2) {
          subquery.bool.must.push(
            { 'term': { [item[0]]: item[1] } }
          )
        }
      })
      if (subquery.bool.must.length > 0) {
        query.query.bool.should.push(subquery)
      }
    })
    if (query.query.bool.should.length > 0) {
      requestBody = query
    }
  }

  if (typeof order != 'undefined' && typeof sort != 'undefined') {
    requestBody.sort = {
      [sort]: order
    }
  }

  if (limit > 1000) {
    limit = 1000
  }
  requestBody.size = limit
  requestBody.from = offset

  console.log(JSON.stringify(requestBody))

  try {
    const { body } = await elasticClient.search({
      index: conf.es_request_options.index,
      body: requestBody
    })
    return _prepareOutput(body)
  } catch (err) {
    throw boom.boomify(err)
  }
}

//Update exist data
exports.update = async (id, params) => {

}

//Delete row by ID
exports.delete = async (id) => {

}

exports.getFieldValues = async (fieldName) => {
  const { body } = await elasticClient.search({
    index: conf.es_request_options.index,
    body: {
      'aggs': {
        'fieldValues': {
          'terms': {
            'field': fieldName
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
}

_prepareOutput = (data) => {
  let result = {
    total: data.hits.total.value,
    items_count: 0,
    items: []
  }
  const hits = data.hits.hits
  hits.forEach((hit) => {
    result.items.push(hit._source)
  })
  result.items_count = result.items.length
  return result
}

_save_error = async (message) => {
  console.log(message)
  message.request = {
    ip: '',
    timestamp: new Date().toISOString()
  }
  await elasticClient.index({
    index: conf.es_request_options.error_index,
    body: message
  })
  console.log('[+] Error message to Audit Log')
}

_check_indices = async () => {
  try {
    return await elasticClient.indices.exists({
      index: conf.es_request_options.index
    })
  } catch (e) {
    console.log(e)
  }
}

_create_index = async () => {
  try {
    return await elasticClient.indices.create({
      index: conf.es_request_options.index
    })
  } catch (e) {
    console.log(e)
  }
}

_set_mappings = async (mapping) => {
  try {
    return await elasticClient.indices.putMapping({
      index: conf.es_request_options.index,
      body: {
        properties: mapping
      }
    })
  } catch (e) {
    console.log(e)
  }
}

_mapping = () => {
  return {
    'id': {
      'type': 'keyword',
      'ignore_above': 256
    },
    'actor': {
      'properties': {
        'group': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'id': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'name': {
          'type': 'keyword',
          'ignore_above': 256
        }
      }
    },
    'app': {
      'properties': {
        'build': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'name': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'server': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'stage': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'version': {
          'type': 'keyword',
          'ignore_above': 256
        }
      }
    },
    'entity': {
      'properties': {
        'group': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'id': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'name': {
          'type': 'keyword',
          'ignore_above': 256
        }
      }
    },
    'changes': {
      'type': 'nested',
      'properties': {
        'name': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'created': {
          'type': 'date',
          'format': 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd'
        },
        'ip': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'groupId':
          {
            'type': 'keyword',
            'ignore_above': 256
          },
        'groupName': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'newValue': {
          'type': 'text',
          'fields': {
            'keyword': {
              'type': 'keyword',
              'ignore_above': 256
            }
          }
        },
        'oldValue': {
          'type': 'text',
          'fields': {
            'keyword': {
              'type': 'keyword',
              'ignore_above': 256
            }
          }
        },
      }
    },
    'request': {
      'properties': {
        'ip': {
          'type': 'keyword',
          'ignore_above': 256
        },
        'timestamp': {
          'type': 'date'
        }
      }
    }
  }
}