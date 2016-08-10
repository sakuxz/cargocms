module.exports = {
  attributes: {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    locale: {
      type: Sequelize.STRING,
      defaultValues: 'zh_TW'
    },
    displayName: {
      type: Sequelize.VIRTUAL,
      get: function() {
        const locale = this.getDataValue('locale');
        const firstName = this.getDataValue('firstName');
        const lastName = this.getDataValue('lastName');

        let displayName = firstName + lastName;
        if (locale === 'zh_TW') displayName = lastName + firstName;

        return displayName;
      }
    },
    RolesArray: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const roles = this.Roles ? this.Roles.map((role) => role.authority) : [];
          return roles;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    userAgent: {
      type: Sequelize.STRING,
    },
    lastLogin: {
      type: Sequelize.DATE,
    }
  },
  associations: function() {
    User.hasMany(Image, {
      foreignKey: {
        name: 'UserId'
      }
    });
    User.hasMany(Post, {
      foreignKey: {
        name: 'UserId'
      }
    });
    User.hasMany(Passport, {
      foreignKey: {
        name: 'UserId'
      }
    });
    User.hasMany(Recipe, {
      foreignKey: {
        name: 'UserId'
      }
    });
    User.belongsToMany(Role, {
      through: 'UserRole',
      foreignKey: {
        name: 'UserId',
        as: 'Roles'
      }
    });
  },
  options: {
    // tableName: 'Users',
    classMethods: {
      findOneWithPassport: async function({id}) {
        sails.log.info("findOneWithPassport id=>", id);
        return await User.findOne({
          where: {
            id
          },
          include: [ Role, {
              model: Passport,
              where: { provider: 'local' }
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
      loginSuccess: async function({ userAgent }) {
        const now = new Date();
        this.userAgent = userAgent;
        this.lastLogin = now.getTime();
        await this.save();
      }
    },
    hooks: {
      afterCreate: async function(user, options) {
        const userRole = await Role.findOne({where: {authority: 'user'}});
        sails.log.info(userRole.toJSON());
        await user.addRole(userRole);
      }
    }
  }
};
