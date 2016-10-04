import moment from 'moment';

module.exports = {
  attributes: {
    fullPicture: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    message: {
      type: Sequelize.STRING,
    },
    story: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    link: {
      type: Sequelize.STRING,
    },
    sourceId: {
      type: Sequelize.STRING,
      unique: true,
    },
    createdTime: {
      type: Sequelize.DATE,
      get: function() {
        try {
          return moment(this.getDataValue('createdTime')).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    publish: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    updatedAt: {
      type: Sequelize.DATE,
      get: function() {
        try {
          return moment(this.getDataValue('updatedAt')).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    createdAt: {
      type: Sequelize.DATE,
      get: function() {
        try {
          return moment(this.getDataValue('createdAt')).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
  },
  associations: function() {

  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
