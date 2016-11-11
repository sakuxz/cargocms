module.exports = {
  create: async ( data ) => {
    try{
      let item;
      let sameTitle = await Feeling.findOne({
        where:{
          title: data.title
        }
      });

      data.totalRepeat = "1";
      data.score = "1";

      if (!sameTitle){
        item = await Feeling.create(data);
      } else {
        let newTotalRepeat = ( Number(sameTitle.totalRepeat) + 1).toString();

        sameTitle = await Feeling.update({
          totalRepeat: newTotalRepeat
        },{
          where:{
            title: data.title
          }
        });

        data.totalRepeat = newTotalRepeat;
        item = await Feeling.create(data);
      }

      await ScentService.updateByFeeling(data);

      return item;
    }
    catch(e){
      sails.log.error(e);
      throw e;
    }
  },
}
