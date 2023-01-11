exports.options = {
	server: process.env.RABBITMQ_SERVER || 'amqp://127.0.0.1:5672',
	queue: process.env.RABBITMQ_QUEUE || 'audit_log',
	backupQueue: process.env.RABBITMQ_BACKUP_QUEUE || 'audit_log_backup',
	mainExchange: process.env.RABBITMQ_MAIN_EXCHANGE || 'exch_main',
	backupExchange: process.env.RABBITMQ_BACKUP_EXCHANGE || 'exch_backup'
}