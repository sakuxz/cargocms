describe('about labfnp Main Controller operation.', function() {
  before(async (done) => {

    const recipeLoveAgain = {
      formula:[
        {"drops":"1","scent":"BA69","color":"#E87728"},
        {"drops":"2","scent":"BA70","color":"#B35721"}
      ],
      formulaLogs: '',
      authorName: '王大明',
      perfumeName: 'love again',
      description: 'this is love again',
      message: '備註',
      UserId: 1,
    };

    let testRecipe = await Recipe.create(recipeLoveAgain);
    done();

  })
  it('labfnp Main Controller explore action filter user should be success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .get(`/lab`)
      done();
    } catch (e) {
      done(e);
    }
  });
});
