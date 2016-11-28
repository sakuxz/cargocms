var config = require("./config/local.js")

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
console.log("=== config.newrelic ===", config.newrelic);
exports.config = config.newrelic;
