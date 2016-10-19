module.exports = {
  attributes: {
    feeling: {
      type: Sequelize.STRING,
      allowNull: false
    },

    scentName: {
      type: Sequelize.STRING,
      allowNull: false
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
