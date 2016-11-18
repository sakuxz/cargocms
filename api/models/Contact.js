import moment from 'moment';

module.exports = {
  attributes: {
    name: Sequelize.STRING(100),
    email: Sequelize.STRING(255),
    subject: Sequelize.STRING(255),
    content: Sequelize.TEXT,
    success: Sequelize.BOOLEAN,
    phone: Sequelize.STRING(50),
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
  associations: () => {
  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
