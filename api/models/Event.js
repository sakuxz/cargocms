module.exports = {
  attributes: {
    limit: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    signupCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    price: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    title: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: Sequelize.STRING,
    sellStartDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    sellEndDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    eventStartDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    eventEndDate: {
      type: Sequelize.DATE,
      allowNull: false
    }

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
