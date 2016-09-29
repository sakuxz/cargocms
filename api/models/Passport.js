import bcrypt from "bcrypt"
import crypto from "crypto"

module.exports = {
  attributes: {
    protocol: Sequelize.STRING,
    password: Sequelize.STRING,
    accessToken: Sequelize.STRING,
    provider: Sequelize.STRING,
    identifier: Sequelize.STRING,
    tokens: {
      type: Sequelize.TEXT,
      get: function() {
        var value;
        if (value = this.getDataValue('tokens')) {
          return JSON.parse(value);
        } else {
          return [];
        }
      },
      set: function(value) {
        sails.log.info('value', value);
        return this.setDataValue('tokens', JSON.stringify(value));
      }
    },
    salt: Sequelize.STRING
  },

  associations: function() {
    Passport.belongsTo(User);
  },
  options: {
    // tableName: 'Passports',
    classMethods: {
      hashPassword: async (passport) => {

        await new Promise((defer, reject) => {
          if (passport.password) {
            bcrypt.hash(passport.password, 10, function (err, hash) {
              passport.password = hash
              defer();
            });
          } else {
            defer();
          }
        });

      },
      createDefaultLocalProviderIfNotExist: async function (user) {
        try {

          let localPassport = await Passport.findOne({
            where: {
              provider: 'local',
              UserId: user.id
            }
          });
          console.log('localPassport ==', localPassport);
          if(localPassport == null){
            let newLocalPassport = {
              provider: "local",
              password: "password",
              UserId: user.id
            }
            console.log("=== newLocalPassport ===", newLocalPassport);
            await Passport.create(newLocalPassport);
          }

        } catch (e) {
          throw e;
        }
      }
    },
    instanceMethods: {
      validatePassword: async function (password) {
        try {
          var that = this;
          var result = await new Promise((defer, reject) => {

            if(password === that.password){
              defer(true);
            }

            bcrypt.compare(password, that.password, (err, result) => {
              if (err) defer(false);
              else defer(result);
            });
          });

          if(result) return result;

          console.log("=== this.salt ===", that.salt);
          console.log("=== this.salt ===", result);
          if(!this.salt) return result;

          console.log("=== check two ===");
          var comparePassword = crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');

          if(comparePassword == that.password){
            result = true
          }

          return result

        } catch (e) {
          throw e;
        }
      }
    },
    hooks: {
      beforeCreate: async (passport) => {
        await Passport.hashPassword(passport);
      },
      beforeUpdate: async (passport) => {
        await Passport.hashPassword(passport);
      }
    }
  }
}
