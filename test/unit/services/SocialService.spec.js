describe('about Social Service operation.', function() {
  before(async (done) => {

    const recipes = [{
      formula:[
        {"drops":"1","scent":"BA69","color":"#E87728"},
        {"drops":"2","scent":"BA70","color":"#B35721"}
      ],
      formulaLogs: '',
      authorName: '王大明',
      perfumeName: 'test again',
      description: 'this is love again',
      message: '備註',
      UserId: 1,
    }, {
      formula:[
        {"drops":"1","scent":"BA69","color":"#E87728"},
        {"drops":"2","scent":"BA70","color":"#B35721"}
      ],
      formulaLogs: '',
      authorName: '王大明',
      perfumeName: 'test again',
      description: 'this is love again',
      message: '備註',
      UserId: 1,
    }];

    await Recipe.bulkCreate(recipes);
    done();

  })

  it('get social data should be success.', async (done) => {
    try {
      const recipes = await Recipe.findAll();
      let social = SocialService.forRecipe({recipes});;
      console.log("social", JSON.stringify(social, null, 2));

      done();
    } catch (e) {
      done(e);
    }
  });
});
