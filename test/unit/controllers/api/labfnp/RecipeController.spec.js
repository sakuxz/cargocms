var sinon = require('sinon');
describe('about LikeRecipe Controller operation.', function() {

  let recipe, user, recipeNew, userNew;
  before(async (done) => {
    try {
      user = await User.create({
        username: 'likeRecipeUserController',
        email: 'likeRecipeUserController@gmail.com',
        password: ''
      });
      sinon.stub(AuthService, 'getSessionUser', (req) => {
        return user.toJSON();
      });
      recipe = await Recipe.create({
        formula:[
          {"drops":"1","scent":"BA69","color":"#E87728"},
          {"drops":"2","scent":"BA70","color":"#B35721"}
        ],
        formulaLogs: '',
        authorName: '王大明',
        perfumeName: 'love test',
        message: 'this is love test',
        UserId: user.id,
      });
      const scent = await Scent.create({name: 'A100'});
      await Scent.bulkCreate([
        { name: 'B100' },
        { name: 'BA69' },
        { name: 'BA70' },
        { name: 'T14' },
        { name: 'T29' }
      ]);
      await ScentFeedback.create({
        feeling: 'test',
        ScentId: scent.id,
        UserId: user.id,
      })
      await ScentFeedback.create({
        feeling: 'ABC',
        ScentId: scent.id,
        UserId: user.id,
      })

      userNew = await User.create({
        username: 'Test',
        email: 'test@test.com',
        password: ''
      });
      recipeNew = await Recipe.create({
        formula:[
          {"drops":"1","scent":"BA69","color":"#E87728"},
          {"drops":"2","scent":"BA70","color":"#B35721"}
        ],
        formulaLogs: '',
        authorName: 'Test',
        perfumeName: 'Hello World',
        visibility: 'PUBLIC',
        message: 'Testing',
        UserId: userNew.id,
      });

      done()
    } catch (e) {
      done(e)
    }
  });

  after((done) => {
    AuthService.getSessionUser.restore();
    done();
  });

  it('Recipe create should be success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .post(`/api/labfnp/recipe`)
      .send({
        authorName: 'Recipe create',
        perfumeName: 'sdf',
        formulaLogs: '',
        formula:
         [ { scent: 'T14',
             drops: '1',
             color: '#227059',
             userFeeling: ['AAA', 'VVV', 'CCC'] },
           { scent: 'T29',
             drops: '1',
             color: '#E5127F',
             userFeeling: ['BB', 'VVV', 'A'] } ],
        visibility: 'PRIVATE',
        description: 'sdfsf',
        coverPhotoId: '',
        createdBy: 'scent',
        feedback: [ 'sdasd' ],
        UserId: user.id }
      )
      res.status.should.be.eq(200);
      let check = await ScentFeedback.findAll();
      check.length.should.be.above(0);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('Recipe like action should be success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .get(`/api/labfnp/recipe/like/${recipe.id}`)
      res.status.should.be.eq(200);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('Recipe unlike should be success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .get(`/api/labfnp/recipe/unlike/${recipe.id}`)
      res.status.should.be.eq(200);
      done();
    } catch (e) {
      done(e);
    }
  });

  it.skip('Recipe feelings create should be success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .post(`/api/labfnp/recipe/feedback`)
      .send({
        invoiceNo: '123',
        tradeNo: 1608301610017019,
        feeling: '清香的植物味,123',
        scentFeeling: { BA69: '水果香,蜂蜜', BA70: '冰淇淋' },
      });
      res.status.should.be.eq(200);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('Recipe feedback should be success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .get(`/api/labfnp/recipe/${recipe.id}/feelings`);
      res.status.should.be.eq(200);

      sails.log(res.body.data);
      // test content
      res.body.data.feelings.should.be.Array;

      done();
    } catch (e) {
      done(e);
    }
  });


  it.skip('Recipe update should be success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .put(`/api/labfnp/recipe/${recipe.id}`)
      .send({
        authorName: 'Recipe create',
        perfumeName: 'sdf',
        formulaLogs: '',
        formula:
         [ { scent: 'A100',
             drops: '1',
             color: '#227059',
             userFeeling: ['test','123'] },
           {
             scent: 'B100',
             drops: '1',
             color: '#227059',
             userFeeling: ['test','BBB']
           }],
        visibility: 'PRIVATE',
        description: 'sdfsf',
        coverPhotoId: '',
        createdBy: 'scent',
        feedback: [ 'sdfsfsdf' ],
        UserId: user.id }
      )
      res.status.should.be.eq(200);
      // let check = await ScentFeedback.findAll();
      // console.log(check);
      // check.length.should.be.above(0);
      done();
    } catch (e) {
      done(e);
    }
  });
  it('get user recipe success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .get(`/api/labfnp/user/recipe`);
      res.body.data.should.be.Object;
      res.body.data.recipes[0].message.should.be.String;
      res.body.data.recipes[0].UserId.should.be.equal(user.id)
      done();
    } catch (e) {
      done(e);
    }
  });
  it('get another user recipe success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .get(`/api/labfnp/user/recipe/${userNew.id}`);
      res.body.data.should.be.Object;
      res.body.data.recipes[0].message.should.be.String;
      res.body.data.recipes[0].UserId.should.be.equal(userNew.id)
      done();
    } catch (e) {
      done(e);
    }
  });
  it('get user favorite recipe success.', async (done) => {
    try {
      await UserLikeRecipe.create({
        RecipeId: recipe.id,
        UserId: user.id,
      })

      const res = await request(sails.hooks.http.app)
      .get('/api/labfnp/user/fav');
      res.body.data.recipes[0].id.should.be.equal(recipe.id)
      done();
    } catch (e) {
      done(e);
    }
  });
  it('get another user favorite recipe success.', async (done) => {
    try {
      await UserLikeRecipe.create({
        RecipeId: recipeNew.id,
        UserId: userNew.id,
      })

      const res = await request(sails.hooks.http.app)
      .get(`/api/labfnp/user/fav/${userNew.id}`);
      res.body.data.recipes[0].id.should.be.equal(recipeNew.id)
      done();
    } catch (e) {
      done(e);
    }
  });


});
