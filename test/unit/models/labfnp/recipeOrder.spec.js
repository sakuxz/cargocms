describe('test Recipe Order model operation', function() {
  describe("find With Like User", () => {
    let recipeOrderTest, testUser;
    before(async (done) => {
      try {
        testUser = await User.create({
          username: 'testOrderUser',
          email: 'testOrderUser@gmail.com',
          password: ''
        });

        recipeOrderTest = await Recipe.create({
          formula:[
            {"drops":"1","scent":"BA69","color":"#E87728"},
            {"drops":"2","scent":"BA70","color":"#B35721"}
          ],
          formulaLogs: '',
          authorName: '王大明',
          perfumeName: 'love test',
          message: 'this is love test',
          UserId: testUser.id,
        });

        done()

      } catch (e) {
        done(e)
      }
    })


    it('create order', async (done) => {
      try {
        let recipeOrder = await RecipeOrder.create({
          remark: '123',
          UserId: testUser.id,
          RecipeId: recipeOrderTest.id,
        });
        done();
      } catch (e) {
        done(e);
      }
    });

  });


  describe("find With RecipeOrder", () => {
    let recipeOrderTest, testUser, recipeOrder;
    before(async (done) => {
      try {
        testUser = await User.create({
          username: 'testfindOrderUser',
          email: 'testfindOrderUser@gmail.com',
          password: ''
        });

        recipeOrderTest = await Recipe.create({
          formula:[
            {"drops":"1","scent":"BA69","color":"#E87728"},
            {"drops":"2","scent":"BA70","color":"#B35721"}
          ],
          formulaLogs: '',
          authorName: '王大明',
          perfumeName: 'love test',
          message: 'this is love test',
          UserId: testUser.id,
        });

        recipeOrder = await RecipeOrder.create({
          remark: '123',
          UserId: testUser.id,
          RecipeId: recipeOrderTest.id,
        });

        done()

      } catch (e) {
        done(e)
      }
    })


    it('finde order', async (done) => {
      try {
        let result = await RecipeOrder.findByIdHasJoin(recipeOrder.id);
        sails.log.debug(result.toJSON());
        done();
      } catch (e) {
        done(e);
      }
    });

  });


});
