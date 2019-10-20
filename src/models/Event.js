const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
	request: String,
	session: String,
	actor: String,
	actorType: String,
	actorAlias: String,
	eventType: String,
	entity: String,
	entityId: String,
	entityProperties: [
		new mongoose.Schema({
			_id: mongoose.Schema.Types.ObjectId,
			propertyEntity: String,
			propertyId: String,
			propertyName: String,
			oldValue: String,
			newValue: String,
		})],
	created: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Event', eventSchema)
/*

Who ? What ? When ?

const schema = {
	actor: {
		type: 'object',
		properties: {
			id: {type: 'string'},
			name: {type: 'string'},
			group: {type: 'string'},
		}
	},
	event: {
		type: 'object',
		properties: {
			id: {type: 'string'},
			ip: {type: 'string'},
			description: {type: 'string'},
			created: {type: 'string'},
			details: {
				type: 'object',
				properties: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							name: {type: 'string'},
							group: {
								type: 'object',
								properties: {
									id: {type: 'string'},
									name: {type: 'string'},
								},
							},
							action: {type: 'string'},
							oldValue: {type: 'string'},
							newValue: {type: 'string'},
						}
					}
				}
			}
		}
	},
	entity: {
		type: 'object',
		properties: {
			id: {type: 'string'},
			name: {type: 'string'},
			group: {type: 'string'},
		}
	},
	app: {
		type: 'object',
		properties: {
			name: {type: 'string'},
			server: {type: 'string'},
			version: {type: 'string'},
			build: {type: 'string'},
		}
	},
	request: {
		type: 'object',
		properties: {
			ip: {type: 'string'}, //IP from request
			timestamp: {type: 'string'} //Current timestamp on api server
		}
	},
}

//Cases

//Last login update

const data = {
	actor: {
		id: 1,
		name: "John",
		group: "Admin",
	},
	entity: {
		id: 55,
		name: "Customer",
		group: "Customer",  //Realy need it?
	},
	event: {
		id: "retyg23j23jsdsdkj",
		ip: "192.168.22.11",
		description: "Customer login success",
		created: "2019-10-11 17:03:55",
		details: [
			{
				group: {
					id: 55,
					name: "Customer"
				},
				field: "last_login",
				action: "update",
				oldValue: "2019-10-10 13:03:55",
				newValue: "2019-10-11 17:03:55",
			}
			],
	},
	app: {
		name: "Abantecart",
		server: "",
		version: "2.0",
		build: "1.1.0",
	},
	request: {
		ip: "",
		timestamp: "2019-10-11 17:04:55"
	},
}


//Update Customer Details

const data = {
	actor: {
		id: 1,
		name: "John",
		group: "Admin",
	},
	entity: {
		id: 55,
		name: "Customer",
		group: "Customer",  //Realy need it?
	},
	event: {
		id: "retyg23j23jsdsdkj",
		ip: "192.168.22.11",
		description: "Update Customer",
		created: "2019-10-11 17:03:55",
		details: [
			{
				group: {
					id: 55,
					name: "Customer"
				},
				field: "firstname",
				action: "update",
				oldValue: "Ivan",
				newValue: "Petrov",
			},
			{
				group: {
					id: 20,
					name: "CustomerAddress"
				},
				field: "street",
				action: "create",
				oldValue: "",
				newValue: "Some av",
			},
		],
	},
	app: {
		name: "Abantecart",
		server: "",
		version: "2.0",
		build: "1.1.0",
	},
	request: {
		ip: "",
		timestamp: "2019-10-11 17:04:55"
	},
}*/
