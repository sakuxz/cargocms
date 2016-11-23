module.exports = {
  attributes: {
    name: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    sequence: {
      type: Sequelize.INTEGER
    },
    feelings: {
      type: Sequelize.TEXT,
      set: function (val) {
        if (val) {
          this.setDataValue('feelings', JSON.stringify(val));
        }
        else {
          this.setDataValue('feelings', "[]");
        }
      },
      get: function () {
        try {
          var feelings = this.getDataValue('feelings');
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
    displayFeeling: {
      type: Sequelize.VIRTUAL,
      get: function () {
        try {
          const feelings = this.getDataValue('feelings');

          if (feelings) {
            let dataJson = JSON.parse(feelings);
            let NumOfData = dataJson.length;
            let displayFeeling = [];
            for(var i=0 ; i<NumOfData ; i++){
              displayFeeling.push(dataJson[i]["key"]);
            }
            return displayFeeling;
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
    Scent.belongsTo(ScentNote);
    // Scent.hasMany(Feeling, {
    //   foreignKey: {
    //     name: 'ScentId'
    //   }
    // });
  },
  options: {
    timestamps: false,
    paranoid: true,
    classMethods: {

      /**
       * 查詢所有香味分子
       */
      findAllWithRelation: async function() {
        return await Scent.findAll({
          include: [
            ScentNote
          ],
          order: 'sequence ASC',
        });
      },

      formatForApp: async function({scents}) {

        let result = scents.map((scent) => {
          const {id, name, sequence, feelings, title, description, displayFeeling } = scent
          let color = ""
          let scentNote = ""
          if (scent.ScentNote) {
            scentNote = scent.ScentNote.toJSON();
            color = scent.ScentNote.color;
          }

          // let feelings = scent.Feelings.map((feeling) => {
          //   let {id, title} = feeling;
          //   return {id, title}
          // });

          return {id, sequence, name, color, feelings, title, description, scentNote, displayFeeling}
        });

        return result
      },

      findAllWithRelationFormatForApp: async function(){
        let scents = await Scent.findAllWithRelation();
        let result = await Scent.formatForApp({scents});
        return result;
      }

    },
    instanceMethods: {},
    hooks: {}
  }
};
