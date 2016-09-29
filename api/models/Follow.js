module.exports = {
  attributes: {

  },
  associations: () => {
    Follow.belongsTo(User, {
      foreignKey: {
        name: 'follower'
      }
    });
    Follow.belongsTo(User, {
      foreignKey: {
        name: 'following'
      }
    });

  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
