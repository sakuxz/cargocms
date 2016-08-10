module.exports = {
  attributes: {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    }
  },
  associations: function() {
    Scent.belongsTo(ScentNote);
    Scent.hasMany(Feeling, {
      foreignKey: {
        name: 'ScentId'
      }
    });
  },
  options: {
    classMethods: {
      findAllWithRelation: async function(){
        let findScents = await Scent.findAll({
          include: [Feeling, ScentNote]
        });

        return findScents;
      },

      formatForApp: async function({scents}){

        let result = scents.map((scent) => {
          let {name} = scent
          let color = ""
          let scentNote = ""
          if(scent.ScentNote){
            scentNote = scent.ScentNote.id
            color = scent.ScentNote.color
          }

          let feelings = scent.Feelings.map((feeling) => {
            let {id, title} = feeling;
            return {id, title}
          })
          return {name, color, feelings, scentNote}
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
