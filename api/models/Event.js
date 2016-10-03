module.exports = {
  attributes: {
    limit: Sequelize.STRING,
    price: Sequelize.STRING,
    title: Sequelize.STRING,
    saleStartDate: Sequelize.STRING,
    saleEndDate: Sequelize.STRING,
    eventStartDate: Sequelize.STRING,
    eventEndDate: Sequelize.STRING
  },

  associate: (models) => {
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
  }

};
