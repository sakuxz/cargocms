module.exports = {
  attributes: {
    feeling: {
      type: Sequelize.STRING,
      allowNull: false
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
          return await Allpay.destroy({ where: { id } });
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
