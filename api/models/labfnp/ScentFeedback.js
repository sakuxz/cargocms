import moment from 'moment';

module.exports = {
  attributes: {
    feeling: {
      type: Sequelize.STRING,
      allowNull: false
    },

    feedbackCheck: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },

    scentName: {
      type: Sequelize.VIRTUAL,
      get: function () {
        try {
          const scent = this.getDataValue('Scent');
          return scent ? scent.name : '';
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    userName: {
      type: Sequelize.VIRTUAL,
      get: function () {
        try {
          const user = this.getDataValue('User');
          return user ? user.displayName : '';
        } catch (e) {
          sails.log.error(e);
        }
      }
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
    ScentFeedback.belongsTo(User);
    ScentFeedback.belongsTo(Scent);
  },
  options: {
    classMethods: {
      deleteById: async (id) => {
        try {
          return await ScentFeedback.destroy({ where: { id } });
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },
    instanceMethods: {},
    hooks: {}
  }
};
