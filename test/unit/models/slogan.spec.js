describe('about Slogan model operation.', function() {

  it('create Slogan should success.', async (done) => {
    try {
      const newSlogan = await Slogan.create({
        content: 'We are pokemon trainer',
        source: 'Ash Ketchum'
      });
      sails.log.info('create slogan model spec =>', newSlogan);
      newSlogan.should.be.Object;
      newSlogan.content.should.be.equal('We are pokemon trainer');
      newSlogan.source.should.be.equal('Ash Ketchum');
      done();
    } catch (e) {
      done(e);
    }
  });

});
