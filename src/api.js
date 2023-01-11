global.__base = __dirname;
//Load configs
global.conf = require(`${__base}/config/config`);

global.esItited = false

switch (conf.storageDriver) {
	case 'elastic_search':
		global.storageDriver = require(`${__base}/models/drivers/elastic_search`)
		break
	case 'mongo_db':
		global.storageDriver = require(`${__base}/models/drivers/mongodb`)
		break
	default:
		console.error('Please specify Storage Driver')
		process.exit(1)
}

global.boom = require('boom')

// Require the framework and instantiate it
const fastify = require('fastify')({
	logger: true
})

const cors = require('cors')
fastify.use(cors())

const routes = require('./routes')


// Register Swagger
fastify.register(require('fastify-swagger'), conf.swagger)


routes.forEach((route, index) => {
	fastify.route(route)
})


if (require.main === module) {
	try {
		fastify.listen(3100, '0.0.0.0', (err) => {
			if (err) console.error(err)
			fastify.swagger()
			console.log(`server listening on ${fastify.server.address().port}`)
		})
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
} else {
	// required as a module => executed on aws lambda
	module.exports = fastify
}
