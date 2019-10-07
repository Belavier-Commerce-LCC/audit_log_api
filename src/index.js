//Connecting to ElasticSearch
const elasticSettings = require('./config/elasticSearch')
const {Client} = require('@elastic/elasticsearch')
const elasticClient = new Client(elasticSettings.options)

// Require the framework and instantiate it
const fastify = require('fastify')({
	logger: true
})

const cors = require('cors')
fastify.use(cors())
const mongoose = require('mongoose')
mongoose.connect('mongodb://root:example@localhost/')
	.then(() => console.log('MongoDB connected…'))
	.catch(err => console.log(err))

const routes = require('./routes')

// Import Swagger Options
const swagger = require('./config/swagger')

// Register Swagger
fastify.register(require('fastify-swagger'), swagger.options)

routes.forEach((route, index) => {
	fastify.route(route)
})
// Declare a route
fastify.get('/', async (request, reply) => {
	reply.redirect('/documentation')
})

/*fastify.get('/api/events', async (request, reply) => {
	const { body } =  await elasticClient.search({
		index: 'audit-log-index',
		body: {
			query: {
				match: {
					action: 'Insert'
				}
			}
		}
	})
	return body.hits.hits
})

fastify.get('/api/test', async (request, reply) => {
	const { body } =  await elasticClient.ping()
	return body
}) */


// Run the server!
const start = async () => {
	try {
		await fastify.listen(3001)
		fastify.swagger()
		fastify.log.info(`server listening on ${fastify.server.address().port}`)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}
start()