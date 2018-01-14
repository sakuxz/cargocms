
describe("ImageController test", function() {
  it("create image by file attachment", async function(done) {

    try {
      const res = await request(sails.hooks.http.app)
      .post("/api/admin/upload")
      .attach('uploadPic', __dirname+'/test.png')

      const {body} = res;

      done();
    } catch (e) {
      done(e);
    }
  });
});
