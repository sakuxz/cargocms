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

  },
  associations: function() {
    ScentFeedback.belongsTo(User);
    ScentFeedback.belongsTo(Scent);
  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
