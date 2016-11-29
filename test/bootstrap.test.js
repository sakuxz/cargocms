var Sails = require('sails');
var rc = require("rc");

global.request = require("supertest-as-promised");
global.should = require("chai").should();
global.sinon = require("sinon");
if (process.env.TEST_MODE == "STRESS") 


  before(function(done) {
    var config = rc('sails');
    if (process.env.TEST_MODE == "STRESS")  {
      // ref from https://segmentfault.com/a/1190000004888348
      var fs = require('fs');
      // (see note below)
      setInterval(function takeSnapshot() {
        var mem = process.memoryUsage();
        fs.appendFile('./test/stress/output_serverMemory.xls', 
          mem.rss / 1024 / 1024 + '\t' +
          mem.heapUsed / 1024 / 1024 + '\t' + 
          mem.heapTotal / 1024 / 1024 + '\n', 'utf8');
      }, 1000); // Snapshot every second
      config.environment = 'production';
    }
    else {
      config.environment = 'test';
    }

    Sails.lift(config, function(err, server) {
      sails = server;
      if (err) return done(err);
      done(err, server);
    });
  });

after(function(done) {
  sails.lower(done());
});
