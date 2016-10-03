module.exports = {
  attributes: {
    limit: Sequelize.INTEGER,
    signupCount: Sequelize.INTEGER,
    price: Sequelize.STRING,
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    sellStartDate: Sequelize.DATE,
    sellEndDate: Sequelize.DATE,
    eventStartDate: Sequelize.DATE,
    eventEndDate: Sequelize.DATE

  },

  associations: function() {
    Post.hasMany(Event);

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
