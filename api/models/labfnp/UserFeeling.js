import moment from 'moment';
module.exports = {
  attributes: {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },

    scentName: {
      type: Sequelize.STRING,
      allowNull: false
    },

  },
  associations: function() {
    UserFeeling.belongsTo(User);
  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
