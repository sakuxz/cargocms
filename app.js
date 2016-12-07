var config = require("./config/local.js");

if(config.newrelic){
  console.log("=== load newrelic ===");
  require('newrelic');
}else {
  console.log("=== without newrelic config ===");
}


require("babel-core/register");
require("./server.js")
