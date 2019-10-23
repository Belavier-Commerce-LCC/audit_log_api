exports.storageDriver = process.env.STORAGE_DRIVER || 'elastic_search'

exports.elasticSearch = {
  node: [
    process.env.ES_NODE || 'http://127.0.0.1:9200'
  ],
  maxRetries: process.env.ES_MAX_RETRIES || 5,
  requestTimeout: process.env.ES_REQUEST_TIMEOUT || 1000,
  sniffOnStart: process.env.ES_SNIF_ON_START || false,
  keepAlive: process.env.ES_KEEP_ALIVE || true
}

exports.es_request_options = {
  index: process.env.ES_INDEX || 'audit-log-index',
  error_index: process.env.ES_ERROR_INDEX || 'audit-log-errors'
}

exports.rabbitmq = {
  server: process.env.RABBITMQ_SERVER,
  queue: process.env.RABBITMQ_QUEUE
}

exports.swagger = {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Fastify API',
      description: 'Building a blazing fast REST API with Node.js, MongoDB, Fastify and Swagger',
      version: '1.0.0'
    },
    //externalDocs: {
    //url: 'https://swagger.io',
    //description: 'Find more info here'
    //},
    host: process.env.API_BASE_URL,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
}