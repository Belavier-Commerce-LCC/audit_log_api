const awsLambdaFastify = require('@fastify/aws-lambda')
const app = require('./api')
const proxy = awsLambdaFastify(app)

exports.handler = proxy