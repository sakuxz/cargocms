

describe('about User model operation.', function() {
  describe('test update userAgent', function() {
    let user;
    before(async (done) => {
      try {
        user = await User.create({
          username: `testloginSuccess`,
          email: `testloginSuccess@gmail.com`,
          firstName: 'test',
          lastName: 'loginSuccess'
        });
        let passport = await Passport.create({provider: 'local', password: 'user', UserId: user.id});
        done();
      } catch (e) {
        done(e)
      }
    });

    it('should success.', async (done) => {
      try {
        await user.loginSuccess({ userAgent: 'test' });
        let checkUser = await User.findById(user.id);
        checkUser.userAgent.should.not.eq('');
        done();
      } catch (e) {
        done(e)
      }
    });
  });

  describe('test Delete User', function() {
    let user;
    before(async (done) => {
      try {
        user = await User.create({
          username: `testDelete`,
          email: `testDelete@gmail.com`,
          firstName: 'test',
          lastName: 'Delete'
        });
        let passport = await Passport.create({provider: 'local', password: 'user', UserId: user.id});
        done();
      } catch (e) {
        done(e)
      }
    });

    it('should success.', async (done) => {
      try {
        await User.deleteById(user.id);
        let checkUser = await User.findById(user.id);
        (checkUser === null).should.be.true;
        done();
      } catch (e) {
        done(e)
      }
    });
  });

  describe('User username and email should be unique.', function() {
    let duplicateUserName;
    let duplicateUserEmail;
    let duplicateUserNameEmail;
    before(async (done) => {
      try {
        duplicateUserName = await User.create({
          username: 'aaa',
          email: 'aaa@aaa.aaa',
          firstName: 'test',
          lastName: 'test',
          locale: 'zh_TW',
        });
        duplicateUserEmail = await User.create({
          username: 'bbb',
          email: 'bbb@bbb.bbb',
          firstName: 'test',
          lastName: 'test',
          locale: 'zh_TW',
        });
        duplicateUserNameEmail = await User.create({
          username: 'ccc',
          email: 'ccc@ccc.ccc',
          firstName: 'test',
          lastName: 'test',
          locale: 'zh_TW',
        });
        sails.log.info('duplicateUserName.data.id=>', duplicateUserName.id);
        sails.log.info('duplicateUserEmail.data.id=>', duplicateUserEmail.id);
        sails.log.info('duplicateUserNameEmail.data.id=>', duplicateUserNameEmail.id);
        done();
      } catch (e) {
        done(e);
      }
    });

    it('create User should success.', async (done) => {
      try {
        const createThisUser = await User.create({
          username: 'createThisUserModel',
          email: 'createThisUserModel@xxx.xxx',
          firstName: 'test',
          lastName: 'test',
          locale: 'zh_TW',
        });
        sails.log.info('create user model spec =>', createThisUser);
        createThisUser.should.be.Object;
        createThisUser.locale.should.be.equal('zh_TW');
        done();
      } catch (e) {
        done(e);
      }
    });

    it('create user with duplicate username should failed.', async (done) => {
      try {
        const res = await User.create({
          username: duplicateUserName.username,
          email: 'createThisUserWithDuplicateUserName@xxx.xxx',
          firstName: 'test',
          lastName: 'test',
          locale: 'zh_TW',
        });
        sails.log.info('create user model spec =>', res);
        done(new Error("should be 'unique violation'"));
      } catch (e) {
        sails.log.info('!!!error=>', e);
        sails.log.info('error.type=>', e.errors[0].type);
        const checkError = e.errors[0].message === 'username must be unique';
        if (checkError) done();
        else done(e);
      }
    });

    it('create user with duplicate email should failed.', async (done) => {
      try {
        const res = await User.create({
          username: 'createThisUserWithDuplicateEmail',
          email: duplicateUserName.email,
          firstName: 'test',
          lastName: 'test',
          locale: 'zh_TW',
        });
        done(new Error("should be 'unique violation'"));
      } catch (e) {
        sails.log.info('error.type=>', e.errors[0].type);
        const checkError = e.errors[0].type === 'unique violation';
        if (checkError) done();
        else done(e);
      }
    });

    it('create user with duplicate username and email should failed.', async (done) => {
      try {
        const res = await User.create({
          username: duplicateUserNameEmail.username,
          email: duplicateUserNameEmail.email,
          firstName: 'test',
          lastName: 'test',
          locale: 'zh_TW',
        });
        done(new Error("should be 'unique violation'"));
      } catch (e) {
        sails.log.info('error.type=>', e.errors[0].type);
        const checkError = e.errors[0].type === 'unique violation';
        if (checkError) done();
        else done(e);
      }
    });
  });
});
