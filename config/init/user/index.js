module.exports.init = async () => {
  try {
    User.create({
      username: 'user',
      email: 'user@example.com',
      firstName: '王',
      lastName: '大明'
    }).then(function(user) {
      Passport.create({
        provider: 'local',
        password: 'user',
        UserId: user.id
      });
    });
  } catch (e) {
    console.error(e);
  }
};
