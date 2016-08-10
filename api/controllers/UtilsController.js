/**
 * Utils Controller
 */
const os = require('os-utils');

module.exports = {

  sysInfo: function(req, res) {
    res.ok({
      sysUptime:          os.sysUptime(),
      processUptime:      os.processUptime(),
      totalmem:           os.totalmem(),
      freemem:            os.freemem(),
      freememPercentage:  os.freememPercentage(),
      loadavg:            [os.loadavg(1), os.loadavg(5), os.loadavg(15)],
      cpuCount:           os.cpuCount(),
      platform:           os.platform(),
    });
  },

};
