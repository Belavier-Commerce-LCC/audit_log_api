exports.options = {
	server: process.env.RABBITMQ_SERVER,
	queue: process.env.RABBITMQ_QUEUE,
	backupQueue: process.env.RABBITMQ_BACKUP_QUEUE,
	mainExchange: process.env.RABBITMQ_MAIN_EXCHANGE,
	backupExchange: process.env.RABBITMQ_BACKUP_EXCHANGE,
	acceptablyLag: process.env.RABBITMQ_BACKUP_ACCEPTABLY_DAYS
}