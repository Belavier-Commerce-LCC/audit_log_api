exports.options = {
	node: [
		'http://127.0.0.1:9200'
	],
	maxRetries: 5,
	requestTimeout: 1000,
	sniffOnStart: false,
	keepAlive: true
}

exports.request_options = {
	index: 'audit-log-index'
}