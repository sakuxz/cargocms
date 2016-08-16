module.exports = {
  siteId: 'labfnp',
  // appUrl: 'http://cargo-dev.trunksys.com/',
  // port: 5001,
  urls: {
    afterSignIn: '/lab'
  },
  offAuth: false,
  passport: {
    local: {
      strategy: require('passport-local').Strategy
    },
    facebook: {
      name: 'Facebook',
      protocol: 'oauth2',
      strategy: require('passport-facebook').Strategy,
      options: {
        clientID: '',
        clientSecret: '',
        callbackURL: "http://localhost:5001/auth/facebook/callback",
        profileFields: [
          'id', 'email', 'gender', 'link', 'locale',
          'name', 'timezone', 'updated_time', 'verified',
          'displayName', 'photos'
        ]
      }
    }
  },
  session: {
    secret: '',
  },
  connections: {

    sqlite: {
      database: 'sequelize',
      dialect: 'sqlite',
      options: {
        'dialect': 'sqlite',
        // 'storage': './sqlite.db',
        storage: ':memory:',
        pool: false,
      }
    }
  }
}
