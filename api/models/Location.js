module.exports = {
  attributes: {
    longitude: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: { min: -180, max: 180 }
    },
    latitude: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: { min: -90, max: 90 }
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
  associations: () => {
    Location.hasMany(Post,  {
      foreignKey: {
        name: 'LocationId',
      }
    });
  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
