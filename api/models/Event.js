import moment from 'moment';

module.exports = {
  attributes: {
    limit: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    signupCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    price: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: Sequelize.STRING,
    sellStartDate: {
      type: Sequelize.DATE,
      allowNull: false,
      get: function () {
        try {
          return moment(this.getDataValue('sellStartDate')).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    sellEndDate: {
      type: Sequelize.DATE,
      allowNull: false,
      get: function () {
        try {
          return moment(this.getDataValue('sellEndDate')).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    eventStartDate: {
      type: Sequelize.DATE,
      allowNull: false,
      get: function () {
        try {
          return moment(this.getDataValue('eventStartDate')).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    eventEndDate: {
      type: Sequelize.DATE,
      allowNull: false,
      get: function () {
        try {
          return moment(this.getDataValue('eventEndDate')).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    }

  },

  associations: function() {
    Post.hasMany(Event);

    // Event.belongsToMany(User, {
    //
    //   through: 'UserEvent',
    //   foreignKey: {
    //     name: 'UserId',
    //     as: 'Events'
    //   }
    // });
    //
    // User.belongsToMany(Event, {
    //
    //   through: 'UserEvent',
    //   foreignKey: {
    //     name: 'EventId',
    //     as: 'Users'
    //   }
    // });
  },
  options: {
    classMethods: {
      deleteById: async (id) => {
        try {
          return await Event.destroy({ where: { id } });
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },
    instanceMethods: {},
    hooks: {}
  }
};
