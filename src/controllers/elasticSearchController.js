const elasticSettings = require(`${__base}/config/elasticSearch`)
const {Client} = require('@elastic/elasticsearch')
const elasticClient = new Client(elasticSettings.options)
exports.elasticClient = elasticClient


exports.save = async (message) => {
	message.request = {
		ip: '',
		timestamp: new Date().toISOString()
	}
	const queryObJ = {
		query: {
			bool: {
				must: [
					{
						term: {
							id: message.id
						}
					},
					{
						term: {
							"entity.id": message.entity.id
						}
					},
					{
						term: {
							"entity.name.keyword": message.entity.name
						}
					},
					{
						term: {
							"entity.group.keyword": message.entity.group
						}
					}
				]
			}
		}
	}
	const exists = await elasticClient.search({
		index: elasticSettings.request_options.index,
		body: queryObJ
	})

	const recordCount = exists.body.hits.total.value;

	if (recordCount === 0) {
		await elasticClient.index({
			index: elasticSettings.request_options.index,
			body: message
		})
		await elasticClient.indices.refresh({index: elasticSettings.request_options.index})

		console.log('[+] Writed message to Audit Log')
	} else {
		const existRecords = exists.body.hits.hits;
		let changes = existRecords[0]._source.changes
		message.changes.forEach((el) => {
			changes.push(el)
		})

		await elasticClient.update({
			index: elasticSettings.request_options.index,
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

exports.save_error = async (message) => {
	console.log(message)
	message.request = {
		ip: '',
		timestamp: new Date().toISOString()
	}
	await elasticClient.index({
		index: elasticSettings.request_options.error_index,
		body: message
	})
	console.log('[+] Error message to Audit Log')
}

exports.check_indices = async () => {
	try {
		return await elasticClient.indices.exists({
			index: elasticSettings.request_options.index
		})
	} catch (e) {
		console.log(e)
	}
}

exports.create_index = async () => {
	try {
		return await elasticClient.indices.create({
			index: elasticSettings.request_options.index
		})
	} catch (e) {
		console.log(e)
	}
}

exports.set_mappings = async (mapping) => {
	try {
		await elasticClient.indices.putMapping({
			index: elasticSettings.request_options.index,
			body: {
				properties: mapping
			}
		})
	} catch (e) {
		console.log(e)
	}
}

exports.mapping = () => {
	return {
		"id": {
			"type": "keyword",
			"ignore_above": 256
		},
		"actor": {
			"properties": {
				"group": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"id": {
					"type": "keyword",
					"ignore_above": 256
				},
				"name": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				}
			}
		},
		"app": {
			"properties": {
				"build": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"name": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"server": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"stage": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"version": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				}
			}
		},
		"entity": {
			"properties": {
				"group": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"id": {
					"type": "keyword",
					"ignore_above": 256
				},
				"name": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				}
			}
		},
		"changes": {
			"type": "nested",
			"properties": {
				"name": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"created": {
					"type": "date",
					"format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd"
				},
				"ip": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"groupId":
					{
						"type": "keyword",
						"ignore_above": 256
					},
				"groupName": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"newValue": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"oldValue": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
			}
		},
		"request": {
			"properties": {
				"ip": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
				"timestamp": {
					"type": "date"
				}
			}
		}
	}
}