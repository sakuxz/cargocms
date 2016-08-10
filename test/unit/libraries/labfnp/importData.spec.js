var feelingData = require("./feeling.json");

describe('import data.', () => {
  /*
  {
    "Scent":"BU2",
    "cfeeling":"木質",
    "totalrepeat":18,
    "score":6,
    "color":"#B35721"
  },
  */


  it('import feeling', async (done) => {
    try {
      let path = __dirname+"/feeling.json";
      await ScentNote.importFeelingFromFile({path});
      done();

    } catch (e) {
      done(e);
    }

  });

});
