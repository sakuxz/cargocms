var sinon = require('sinon');
describe('about User Controller operation.', function() {

  let userA, userB, userC;
  before(async (done) => {
    try {
      userA = await User.create({
        username: 'userfollowuserA',
        email: 'userfollowuserA@gmail.com',
        password: ''
      });
      sinon.stub(AuthService, 'getSessionUser', (req) => {
        return userA.toJSON();
      });

      userB = await User.create({
        username: 'userfollowuserB',
        email: 'userfollowuserB@gmail.com',
        password: ''
      });

      userC = await User.create({
        username: 'userfollowuserC',
        email: 'userfollowuserC@gmail.com',
        password: ''
      });

      await Follow.create({
        follower: userA.id,
        following: userC.id
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

  it('userA Follow userB action should be success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .post(`/api/user/follow/${userB.id}`)
      done();
    } catch (e) {
      done(e);
    }
  });

  it('userA unFollow userC action should be success.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .post(`/api/user/unfollow/${userC.id}`)
      done();
    } catch (e) {
      done(e);
    }
  });

});
