describe('about Slogan Controller operation.', function() {
  it('create Slogan should success.', async (done) => {
    const data = {
      content: 'we are pokemon trainer',
      source: 'Ash Ketchum'
    };
    try {
      const res = await request(sails.hooks.http.app)
      .post(`/api/slogan`)
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

  describe('find slogan', () => {
    let newSlogan;
    before(async (done) => {
      try {
        newSlogan = await Slogan.create({
          content: 'we are pokemon trainer',
          source: 'Ash Ketchum'
        });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('find all slogan should success.', async (done) => {
      try {
        const res = await request(sails.hooks.http.app)
        .get(`/api/slogan`);
        res.status.should.be.eq(200);
        res.body.success.should.be.true;
        res.body.should.be.Object;
        res.body.data.should.be.Array;
        res.body.data[0].content.should.be.eq(newSlogan.content);
        res.body.data[0].source.should.be.eq(newSlogan.source);
        done();
      } catch (e) {
        done(e);
      }
    });

    it('find one slogan should success.', async (done) => {
      try {
        const res = await request(sails.hooks.http.app)
        .get(`/api/slogan/${newSlogan.id}`);
        res.status.should.be.eq(200);
        res.body.success.should.be.true;
        res.body.should.be.Object;
        res.body.data.content.should.be.eq(newSlogan.content);
        res.body.data.source.should.be.eq(newSlogan.source);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('update slogan', () => {
    let newSlogan;
    before(async (done) => {
      try {
        newSlogan = await Slogan.create({
          content: 'we are pokemon trainer',
          source: 'Ash Ketchum'
        });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('update slogan should success.', async (done) => {
      try {
        const updataData = {
          content: '123'
        }
        const res = await request(sails.hooks.http.app)
        .put(`/api/slogan/${newSlogan.id}`)
        .send(updataData);
        res.status.should.be.eq(200);
        res.body.success.should.be.true;
        res.body.should.be.Object;
        res.body.data.should.be.Array;
        res.body.data[0].should.be.eq(1)
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('delete slogan', () => {
    let newSlogan;
    before(async (done) => {
      try {
        newSlogan = await Slogan.create({
          content: 'we are pokemon trainer',
          source: 'Ash Ketchum'
        });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('delete slogan should success.', async (done) => {
      try {
        const res = await request(sails.hooks.http.app)
        .delete(`/api/slogan/${newSlogan.id}`);
        res.status.should.be.eq(200);
        res.body.success.should.be.true;
        res.body.data.should.be.Number;
        res.body.data.should.be.eq(1)
        done();
      } catch (e) {
        done(e);
      }
    });
  });

});
