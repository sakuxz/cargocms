describe("traffic test", function() {
  this.timeout(10000000);
  const logPath = "test/stress/output_client/";
  const spawn = require('child_process').spawn;
  let baseURL;
  before(function(done) {
    baseURL = "http://"+sails.config.appUrl+"/";
    done();
  });

  it("make an simple traffic test on index", async function(done) {
    try {
      let url = baseURL;
      let logFilename = logPath + "index.json";
      let beforeTestMemoryUsage = process.memoryUsage();
      const command = spawn('artillery', ['quick','--duration','60','--rate','10','-n','20',url,'-o',logFilename]);

      command.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      command.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      command.on('close', (code) => {
        let afterTestMemoryUsage = process.memoryUsage();
        console.log("=== before traffic test memoryUsage ===");
        console.log(beforeTestMemoryUsage);
        console.log("=== after traffic test memoryUsage ===");
        console.log(afterTestMemoryUsage);

        console.log(`child process exited with code ${code}`);
        if (code>=0) {
          done();
        } else {
          throw("process exit with error!");
        }
      });

    } catch (e) {
      done(e);
    }
  });
});
