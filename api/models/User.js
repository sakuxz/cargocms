import moment from 'moment';

module.exports = {
  attributes: {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    birthday: {
      type: Sequelize.DATE,
      get() {
        try {
          const birthday = this.getDataValue('birthday');

          if (!birthday) {
            return null;
          }

          return moment(new Date(birthday)).format('YYYY/MM/DD');
        } catch (e) {
          sails.log.error(e);
        }
      },
    },
    phone1: {
      type: Sequelize.STRING,
    },
    phone2: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    address2: {
      type: Sequelize.STRING,
    },
    locale: {
      type: Sequelize.STRING,
      defaultValues: 'zh_TW',
    },
    displayName: {
      type: Sequelize.VIRTUAL,
      get() {
        const locale = this.getDataValue('locale');
        const firstName = this.getDataValue('firstName');
        const lastName = this.getDataValue('lastName');

        let displayName = `${firstName  } ${  lastName}`;
        const isTw = locale === 'zh_TW';

        let regExp = /^[\d|a-zA-Z| ]+$/;
        let checkEng = regExp.test(displayName);

        if (!checkEng) {
          displayName = lastName + firstName;
        } else if (isTw) {
          displayName = lastName + firstName;
        }

        if (displayName === '') {
          if (this.getDataValue('username') === '') {
            displayName = this.getDataValue('email');
          } else {
            displayName = this.getDataValue('username');
          }
        }

        return displayName;
      },
    },
    rolesArray: {
      type: Sequelize.VIRTUAL,
      get() {
        try {
          const thisRoles = this.getDataValue('Roles');
          const roles = thisRoles ? thisRoles.map(role => role.authority) : [];
          return roles;
        } catch (e) {
          sails.log.error(e);
        }
      },
    },
    userAgent: {
      type: Sequelize.STRING,
    },
    lastLogin: {
      type: Sequelize.DATE,
      get() {
        try {
          const lastLogin = this.getDataValue('lastLogin');

          if (!lastLogin) {
            return lastLogin;
          }

          return moment(new Date(lastLogin)).format('YYYY/MM/DD HH:mm:SS');
        } catch (e) {
          throw e;
        }
      },
    },
    lastLoginIP: {
      type: Sequelize.STRING,
    },
    lastLoginLat: {
      type: Sequelize.DOUBLE,
    },
    lastLoginLng: {
      type: Sequelize.DOUBLE,
    },
    facebookId: {
      type: Sequelize.STRING,
    },
    avatar: {
      type: Sequelize.STRING,
      get() {
        try {
          const value = this.getDataValue('avatar');
          if (value.startsWith('http')) {
            return value;
          }
          return UtilsService.getUrl(value);
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },
    avatarThumb: {
      type: Sequelize.STRING,
      get() {
        try {
          const value = this.getDataValue('avatarThumb');
          if (value.startsWith('http')) {
            return value;
          }
          return UtilsService.getUrl(value);
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },
    score: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    createdDateTime: {
      type: Sequelize.VIRTUAL,
      get() {
        try {
          return UtilsService.DataTimeFormat(this.getDataValue('createdAt'));
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },

    updatedDateTime: {
      type: Sequelize.VIRTUAL,
      get() {
        try {
          return UtilsService.DataTimeFormat(this.getDataValue('updatedAt'));
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },

    resetPasswordToken: {
      type: Sequelize.STRING(32),
    },

    verificationEmailToken: {
      type: Sequelize.STRING(32),
    },

  },
  associations() {
    User.hasMany(Image, {
      foreignKey: {
        name: 'UserId',
      },
    });
    User.hasMany(Post, {
      foreignKey: {
        name: 'UserId',
      },
    });
    User.hasMany(Passport, {
      foreignKey: {
        name: 'UserId',
      },
    });

    User.belongsToMany(Role, {
      through: 'UserRole',
      foreignKey: {
        name: 'UserId',
        as: 'Roles',
      },
    });
  },
  options: {
    // tableName: 'Users',
    classMethods: {
      async findOneWithPassport({ id }) {
        sails.log.info('findOneWithPassport id=>', id);
        return await User.findOne({
          where: {
            id,
          },
          include: [Role, {
            model: Passport,
            where: { provider: 'local' },
            required: false,
          }],
        });
      },
      deleteById: async (id) => {
        try {
          return await User.destroy({ where: { id } });
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },
    instanceMethods: {
      async loginSuccess({ userAgent }) {
        const now = new Date();
        this.userAgent = userAgent;
        this.lastLogin = now.getTime();
        await this.save();
      },
    },
    hooks: {
      async afterCreate(user, options) {
        const userRole = await Role.findOne({ where: { authority: 'user' } });
        await user.addRole(userRole);
      },
    },
  },
};
