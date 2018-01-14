module.exports = {
  attributes: {
    invoiceNo: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    tradeNo: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    invoiceNoCheck: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    tradeNoCheck: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    feeling: {
      type: Sequelize.TEXT,
      allowNull: false,
      set: function (val) {
        if (val) {
          this.setDataValue('feeling', JSON.stringify(val));
        }
        else {
          this.setDataValue('feeling', "[]");
        }
      },
      get: function () {
        try {
          var feelings = this.getDataValue('feeling');
          if (feelings) {
            return JSON.parse(feelings);
          }
          else {
            return [];
          }
        }
        catch (e) {
          console.log(e);
          return [];
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
    RecipeFeedback.belongsTo(User);
    RecipeFeedback.belongsTo(Recipe);
  },
  options: {
    classMethods: {
    }
  }
};
