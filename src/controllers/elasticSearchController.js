const elasticSettings = require('../config/elasticSearch')
const {Client} = require('@elastic/elasticsearch')
const elasticClient = new Client(elasticSettings.options)
exports.elasticClient = elasticClient

exports.save = async (message) => {
	message.request = {
		ip: '',
		timestamp: new Date().toISOString()
	}
	await elasticClient.index({
		index: elasticSettings.request_options.index,
		body: message
	})
	console.log('[+] Writed message to Audit Log')
}

exports.save_error = async (message) => {
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
				}
			}
		},
		"event": {
			"properties": {
				"action": {
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
				"description": {
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
				},
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
					"type": "text",
					"fields": {
						"keyword": {
							"type": "keyword",
							"ignore_above": 256
						}
					}
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
				"name": {
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
		"related": {
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
				}
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