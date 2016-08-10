module.exports = {
  attributes: {
    authority: Sequelize.STRING
  },

  associate: (models) => {
    User.belongsToMany(Role, {

      through: 'UserRole',
      foreignKey: {
        name: 'RoleId',
        as: 'Users'
      }
    });
  },
  options: {
  }

};
