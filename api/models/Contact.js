import moment from 'moment';

module.exports = {
  attributes: {
    name: Sequelize.STRING(100),
    email: Sequelize.STRING(255),
    subject: Sequelize.STRING(255),
    content: Sequelize.TEXT,
    success: Sequelize.BOOLEAN,
    phone: Sequelize.STRING(50),
    
  },
  associations: () => {
  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
