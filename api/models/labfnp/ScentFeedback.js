import moment from 'moment';

module.exports = {
  attributes: {
    feeling: {
      type: Sequelize.STRING,
      allowNull: false
    },

    createdAt: {
      type: Sequelize.DATE,
      get: function () {
        try {
          return moment(this.getDataValue('createdAt')).format("YYYY/MM/DD HH:mm");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    feedbackCheck: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },

    scentName: {
      type: Sequelize.VIRTUAL,
      get: function () {
        try {
          const scent = this.getDataValue('Scent');
          return scent ? scent.name : '';
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    userName: {
      type: Sequelize.VIRTUAL,
      get: function () {
        try {
          const user = this.getDataValue('User');
          return user ? user.displayName : '';
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

  },
  associations: function() {
    ScentFeedback.belongsTo(User);
    ScentFeedback.belongsTo(Scent);
  },
  options: {
    classMethods: {
      deleteById: async (id) => {
        try {
          return await ScentFeedback.destroy({ where: { id } });
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
