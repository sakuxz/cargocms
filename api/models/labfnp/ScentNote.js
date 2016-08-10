module.exports = {
  attributes: {
    color: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    }


  },
  associations: function() {
    ScentNote.hasMany(Scent, {
      foreignKey: {
        name: 'ScentNoteId'
      }
    });
  },
  options: {
    classMethods: {
      findAllWithRelation: async function(){
        let findScentNotes = await ScentNote.findAll({
          include: [{
            model: Scent,
            include: Feel
          }]
        });
        return findScentNotes;
      },
      importFeelingFromFile: async function({path}){
        var feelingData = require(path);
        try {
          console.log(feelingData.length);
          for (let feelingRow of feelingData) {

            let newScentNote = {
                color: feelingRow.color,
                title: feelingRow.color
            }

            let newScent = {
              name: feelingRow.Scent
            }
            let newFeeling = {
                title: feelingRow.cfeeling
            }

            let scentNote = (await ScentNote.findOrCreate({
              where: {color: newScentNote.color},
              defaults: newScentNote
            }))[0];


            let scent = (await Scent.findOrCreate({
              where: {name: newScent.name},
              defaults: newScent
            }))[0];

            let feeling = (await Feeling.findOrCreate({
              where: {title: newFeeling.title},
              defaults: newFeeling
            }))[0];

            await scentNote.addScent(scent)
            await scent.addFeeling(feeling);
          }

        } catch (e) {
          throw e;
        }


      }
    },
    instanceMethods: {},
    hooks: {}
  }
};
