const apiSettings = require(`${__base}/config/apiConfig`)
const apiClient = require('axios');

exports.save = async (message) => {
  let domain = message.domain
  message = message.data
  /*message.request = {
    ip: '',
    timestamp: new Date().toISOString()
  }*/

  return await apiClient.post(apiSettings.options.server+'/api/event/'+domain, message, {strictSSL: false});
}

