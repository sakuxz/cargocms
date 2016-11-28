describe("traffic test", function() {
  this.timeout(10000000);
  const spawn = require('child_process').spawn;

  it("make an simple traffic test", async function(done) {

    try {
      const url = "http://"+sails.config.appUrl+"/";
      //const ls = spawn('curl', [url]);
      //console.log(url);
      var beforeTestMemoryUsage = process.memoryUsage();
      const command = spawn('artillery', ['quick','--duration','60','--rate','10','-n','20',url]);

      command.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      command.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      command.on('close', (code) => {
        var afterTestMemoryUsage = process.memoryUsage();
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
