describe('test ScentNote.spec model operation', function() {

  let createdScentNote, createdScents, createdFeelings;
  it('create ScentNote Scent Feeling should be success.', async (done) => {
    try {
      let newScentNote = {
          color: "#FFA500",
          title: "Cirtus 柑橘色"
      }
      createdScentNote = await ScentNote.create(newScentNote);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('create Scent should be success.', async (done) => {
    try {
      let newScents = [
        {name: "T12"},
        {name: "M6"},
        {name: "TA53"}
      ]

      let promises = newScents.map((newScent) => {
        return Scent.create(newScent);
      })
      createdScents = await Promise.all(promises);

      done();
    } catch (e) {
      done(e);
    }
  });

  it('create Feeling should be success.', async (done) => {
    try {
      let newFeelings = [
        {title: "柚子清香"},
        {title: "清新"}
      ]

      let promises = newFeelings.map((newFeeling) => {
        return Feeling.create(newFeeling);
      })
      createdFeelings = await Promise.all(promises);

      done();
    } catch (e) {
      done(e);
    }
  });

  it('set relation of ScentNote Scent Feeling should be success.', async (done) => {
    try {
      await createdScentNote.setScents(createdScents);
      await createdScents[0].setFeelings(createdFeelings);
      done();
    } catch (e) {
      done(e);
    }
  });




  it('findOne should be success.', async (done) => {
    try {
      let perfumeName = '香水配方名';
      let {id} = createdScentNote

      let findScentNote = await ScentNote.findOne({
        where: {id},
        include: [{
          model: Scent,
          include: Feeling
        }]
      });
      let findScents = findScentNote.toJSON().Scents
      let findFeelings = findScents[0].Feelings;


      (findScents.length == 3).should.be.true;
      (findFeelings.length == 2).should.be.true;
      console.log("ScentNote: ", JSON.stringify(findScentNote.toJSON(), null, 2));

      done();
    } catch (e) {
      done(e);
    }
  });


  it('findAll Scent should be success.', async (done) => {
    try {
      let findScents = await Scent.findAllWithRelation();

      let findFeelings = findScents[0].toJSON().Feelings;
      (findFeelings.length >= 0).should.be.true;

      done();
    } catch (e) {
      done(e);
    }
  });

  it('findAll Scent and format for APP be success.', async (done) => {
    try {
      let result = await Scent.findAllWithRelationFormatForApp();


      console.log("findScents: ", JSON.stringify(result, null, 2));

      done();
    } catch (e) {
      done(e);
    }
  });



});
