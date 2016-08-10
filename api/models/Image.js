module.exports = {
  attributes: {
    filePath: {
      type: Sequelize.STRING,
    },
    size: {
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.STRING(30),
    },
    storage: {
      type: Sequelize.ENUM('local', 's3', 'url'),
      defaultValue: 'local',
    },
    fileName: {
      type: Sequelize.VIRTUAL,
      get: function() {
        return this.filePath.split('/uploads/')[1];
      }
    },
    url: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          if (this.storage === 'local') {
            return this.filePath.split('/public')[1];
          } else if (this.storage ==='url') {
            return this.filePath;
          } else {
            throw Error('Not implemented');
          }
        } catch (e) {
          salis.log.error(e);
        }
      }
    }
  },
  associations: () => {},
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
