module.exports = {
  attributes: {
    title: {
      type: Sequelize.STRING
    }
  },
  associations: function() {
    Feeling.belongsTo(Scent);
  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
