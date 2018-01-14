import moment from 'moment';

module.exports = {
  attributes: {
    fullPicture: {
      type: Sequelize.TEXT,
    },
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    message: {
      type: Sequelize.TEXT,
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
          return moment(new Date(this.getDataValue('createdTime'))).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    publish: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    createdDateTime:{
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('createdAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    },

    updatedDateTime:{
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('updatedAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    }
  },
  associations: function() {

  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
