module.exports = {
  attributes: {
    title: {
      type: Sequelize.STRING,
    },
  },
  associations: () => {
    Tag.belongsToMany(Post,  {
      through: 'PostTag',
      foreignKey: {
        name: 'TagId',
        as: 'Posts'
      }
    });
  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
