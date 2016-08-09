describe.only('about Slogan Controller operation.', function() {
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
      res.body.message.should.be.eq('create slogan success');
      res.body.success.should.be.true;
      res.body.data.content.should.be.eq(data.content);
      res.body.data.source.should.be.eq(data.source);
      done();
    } catch (e) {
      done(e);
    }
  });

});
