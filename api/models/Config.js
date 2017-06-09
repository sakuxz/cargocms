module.exports = {
  attributes: {
    name: {
      type:  Sequelize.STRING,
      allowNull: false,
    },
    key: {
      type:  Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type:  Sequelize.STRING,
      // allowNull: false,
    },
    value: {
      type:  Sequelize.TEXT,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('text', 'editor', 'url', 'file', 'boolean', 'array'),
      defaultValue: 'text',
      allowNull: false,
    },

    createdDateTime: {
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('createdAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    },
    updatedDateTime: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('updatedAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    },
  },
  associations: function() {

  },
  options: {
    paranoid: true,
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
