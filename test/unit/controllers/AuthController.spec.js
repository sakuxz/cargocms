describe('about Auth Controller operation.', function() {
  it('register user should success.', async (done) => {

    try {

      let newUser = {
        username: 'newUser',
        email: 'newUser@gmail.com',
        password: 'newUser'
      }

      let result = await request(sails.hooks.http.app)
      .post('/auth/local/register')
      .send(newUser);

      let {email} = newUser;
      let checkUser = await User.findOne({
        where: { email },
        include: Passport
      });
      checkUser.email.should.be.equal(newUser.email);
      result.status.should.be.equal(200);

      done();
    } catch (e) {
      done(e);
    }
  });

  describe('login user use eamil', () => {
    let user;
    before(async (done) => {
      try {
        let testuser = {
          email: 'testuser@gmail.com',
          username: 'testuser'
        }

        user = await User.create(testuser);
        await Passport.create({provider: 'local', password: 'testuser', UserId: user.id});
        done();

      } catch (e) {
        done(e);
      }
    });


    it('should be success.', async (done) => {

      try {
        let loginInfo = {
          identifier: 'testuser@gmail.com',
          password: 'testuser'
        }


        let result = await request(sails.hooks.http.app)
        .post('/auth/local')
        .send(loginInfo);

        result.status.should.be.equal(200);

        let checkUser = await User.findById(user.id);
        checkUser.userAgent.should.not.eq('');
        done();
      } catch (e) {
        done(e);
      }

    });
  });

  // 會回傳 403
  describe('create recipe', () => {
    let user;
    it('should be success.', async (done) => {
      try {
        let newUser = {
          username: 'newUser2',
          email: 'newUser2@gmail.com',
          password: 'newUser2'
        }

        let result = await request(sails.hooks.http.app)
        .post('/auth/local/register')
        .send(newUser);
        
        let recipeInfo = {
          "authorName": "Recipe create",
          "perfumeName": "sdf",
          "formulaLogs": "",
          "visibility": "PRIVATE",
          "description": "sdfsf",
          "coverPhotoId": "",
          "createdBy": "scent",
          "feedback": ["sdasd"],
          "formula": [{ "scent": "T14", "drops": "1", "color": "#227059", "userFeeling": ["AAA", "VVV", "CCC"]  }, { "scent": "T29", "drops": "1", "color": "#E5127F", "userFeeling": ["BB", "VVV", "A"]  }]
        }

        let result2 = await request(sails.hooks.http.app)
        .post('/api/labfnp/recipe')
        .auth(result.body.data.Authorization)
        .send(recipeInfo);


        result2.status.should.be.equal(200);

        done();
      } catch (e) {
        done(e);
      }

    });
  });

});
