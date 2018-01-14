module.exports = {
  attributes: {
    title: {
      type: Sequelize.STRING,
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
    Tag.belongsToMany(Post,  {
      through: 'PostTag',
      foreignKey: {
        name: 'TagId',
        as: 'Posts'
      }
    });
  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
