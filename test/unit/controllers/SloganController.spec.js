describe('about Slogan Controller operation.', function() {
  it('create Slogan should success.', async (done) => {
    const data = {
      content: 'we are pokemon trainer',
      source: 'Ash Ketchum'
    };
    try {
      const res = await request(sails.hooks.http.app)
      .post(`/slogan`)
      .send(data);
      res.status.should.be.eq(200);
      res.body.should.be.Object;
      res.body.slogan.content = data.content;
      res.body.slogan.source = data.source;
      done();
    } catch (e) {
      done(e);
    }
  });

});
