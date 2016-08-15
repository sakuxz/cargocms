var feelingData = require("./feeling.json");
describe('import data.', () => {
  /*
  {
    "Scent":"BU2",
    "cfeeling":"木質",
    "totalrepeat":18,
    "score":6,"color":"#B35721"
  },
  */
  before(async (done) => {
    try {
      var scentArray = require("./scent.json");
      for (const sc of scentArray) {
        const scentNote = (await ScentNote.findOrCreate({
          where: {color: sc.color},
          defaults: {color: sc.color},
        }))[0];
        const scent = await Scent.create({name: sc.Scent});
        await scentNote.addScent(scent);
      }
      done();
    } catch (e) {
      done(e);
    }
  });

  it.skip('import feeling', async (done) => {
    try {
      let path = __dirname+"/feeling.json";
      await ScentNote.importFeelingFromFile({path});
      done();

    } catch (e) {
      done(e);
    }

  });

});
