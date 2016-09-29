import fetch from 'node-fetch';

module.exports.init = async () => {
  try {
    const isDevMode = sails.config.environment === 'development';
    const isDropMode = sails.config.models.migrate == 'drop';

    if (isDevMode && isDropMode) {

      fetch('http://api.randomuser.me/?results=100')
      .then(function(res) {
        return res.json();
      })
      .then(function(json) {

        if (json.results) {
          for (var randomuser of json.results) {

            User.create({
              username: randomuser.login.username,
              email: randomuser.email,
              firstName: randomuser.name.first,
              lastName: randomuser.name.last,
              avatar: randomuser.picture.large,
              avatarThumb: randomuser.picture.thumbnail,
//              score: Math.round(Math.random() * 100),
            }).then(function(user) {
              Passport.create({
                provider: 'local',
                password: randomuser.login.password,
                UserId: user.id
              });
            });

          }
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
};
