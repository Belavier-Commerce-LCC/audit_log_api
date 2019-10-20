exports.options = {
	node: [
		process.env.ES_NODE || 'http://127.0.0.1:9200'
	],
	maxRetries: process.env.ES_MAX_RETRIES || 5,
	requestTimeout: process.env.ES_REQUEST_TIMEOUT || 1000,
	sniffOnStart: process.env.ES_SNIF_ON_START || false,
	keepAlive: process.env.ES_KEEP_ALIVE || true
}

exports.request_options = {
	index: process.env.ES_INDEX || 'audit-log-index',
	error_index: process.env.ES_ERROR_INDEX || 'audit-log-errors'
}