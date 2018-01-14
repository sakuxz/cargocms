describe('test Recipe model operation', function() {
  it('build model.', async (done) => {
    try {
      let emptyRecipe = Recipe.build({},{raw: true});
      console.log("emptyRecipe", emptyRecipe.toJSON());
      // 輸出如下
      // { formula: [],
      // message: '沒有備註',
      // description: '沒有描述',
      // visibilityDesc: '公開',
      // updatedAt: '2016/08/26 11:18:45',
      // createdAt: '2016/08/26 11:18:45',
      // authorName: '',
      // perfumeName: '',
      // totalDrops: 0,
      // coverPhoto: '',
      // visibility: 'PUBLIC',
      // id: null }
      done();
    } catch (e) {
      done(e);
    }
  });

  it('create should be success.', async (done) => {
    try {
      let newLabfnpRecipe = {
        formula: [ 'B5:3', 'T14:3' ],
        formulaLogs: "+B4:3;+T14:2;-B4:3",
        authorName: '作者名',
        perfumeName: '香水配方名'
      }

      let createdLabfnpRecipe = await Recipe.create(newLabfnpRecipe);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('findOne should be success.', async (done) => {
    try {
      let perfumeName = '香水配方名';
      let createdLabfnpRecipe = await Recipe.findOne({where: {perfumeName}});

      done();
    } catch (e) {
      done(e);
    }
  });

  describe("find With Like User", () => {
    let recipeLoveTest, testUser, likeUser, testUser2;
    before(async (done) => {
      try {

        testUser = await User.create({
          username: 'testUserLike',
          email: 'testUserLike@gmail.com',
          password: ''
        });

        Passport.create({
          provider: 'facebook',
          identfier: '123',
          password: 'user',
          UserId: testUser.id
        });

        likeUser = await User.create({
          username: 'likeUser',
          email: 'likeUser@gmail.com',
          password: ''
        });
        let newRecipeLoveTest = {
          formula:[
            {"drops":"1","scent":"BA69","color":"#E87728"},
            {"drops":"2","scent":"BA70","color":"#B35721"}
          ],
          formulaLogs: '',
          authorName: '王大明',
          perfumeName: 'love test',
          message: 'this is love test',
          UserId: testUser.id,
          visibility: 'PUBLIC',
        };

        recipeLoveTest = await Recipe.create(newRecipeLoveTest);


        await UserLikeRecipe.createIfNotExist({RecipeId: recipeLoveTest.id, UserId: likeUser.id})
        await UserLikeRecipe.createIfNotExist({RecipeId: recipeLoveTest.id, UserId: likeUser.id})
        await UserLikeRecipe.createIfNotExist({RecipeId: recipeLoveTest.id, UserId: testUser.id})

        // await likeUser.addUserLikeRecipes({RecipeId: recipeLoveTest.id})
        // await testUser.addUserLikeRecipes({RecipeId: recipeLoveTest.id})

        testUser2 = await User.create({
          username: 'testLikeUser',
          email: 'testLikeUser@gmail.com',
          password: ''
        });

        const newRecipeLoveTest2 = {
          formula:[
            {"drops":"1","scent":"BA69","color":"#E87728"},
            {"drops":"2","scent":"BA70","color":"#B35721"}
          ],
          formulaLogs: '',
          authorName: '王大明',
          perfumeName: 'love test',
          message: 'this is love test',
          UserId: testUser.id,
          visibility: 'PUBLIC',
        };
        await Recipe.create(newRecipeLoveTest2);

        let time = '01234567890'
        for(let index of [...time]) {
          await Recipe.create({
            formula:[
              {"drops":"1","scent":"BA69","color":"#E87728"},
              {"drops":"2","scent":"BA70","color":"#B35721"}
            ],
            formulaLogs: '',
            authorName: '王大明',
            perfumeName: 'love test',
            message: 'this is love test',
            UserId: testUser.id,
            visibility: 'PUBLIC'
          });
        }
        done()

      } catch (e) {
        done(e)
      }
    })
    it('find by likeUser should be success.', async (done) => {
      try {
        let user = likeUser;
        let result = await Recipe.findAndIncludeUserLike({currentUser: user, start: 0, length: 5});
        done();
      } catch (e) {
        done(e);
      }
    });
    it('find by testUser should be success.', async (done) => {
      try {
        let user = testUser;
        let result = await Recipe.findAndIncludeUserLike({
          currentUser: user,
          start: 0,
          length: 5,
        });
        console.log("=== result.length ===", result.length);
        result.length.should.be.eq(5);
        console.log(JSON.stringify(result, null, 2));
        done();
      } catch (e) {
        done(e);
      }
    });

    it.skip('should be success.', async (done) => {
      try {
        recipeLoveTest.addUser(testUser2.id, {as: 'LikeRecipes'});
        done()
      } catch (e) {
        done(e);
      }
    });

  })



});
