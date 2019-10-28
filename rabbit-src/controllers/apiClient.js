const apiSettings = require(`${__base}/config/apiConfig`)
const apiClient = require('axios');

exports.save = async (message) => {
  message.request = {
    ip: '',
    timestamp: new Date().toISOString()
  }

  return await apiClient.post(apiSettings.options.server+'/api/event', message);
}

