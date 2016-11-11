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

  destroy: async ( id ) => {
    try{
      let item, scent;
      let feeling = await Feeling.findById(id);

      scent = await Scent.findOne({
        where: {
          name: feeling.scentName
        }
      });

      let scentFeelings = scent.feelings;
      for(let i = 0, len = scentFeelings.length; i < len; i++){
        if(scentFeelings[i].key === feeling.title){
          scentFeelings.splice( i , 1);
          break;
        }
      }
      scent.feelings = scentFeelings;
      await scent.save();

      if( Number(feeling.totalRepeat) > 1 ){
        let newTotalRepeat = (Number(feeling.totalRepeat) - 1).toString();

        await Feeling.update({
          totalRepeat: newTotalRepeat
        },{
          where: {
            title: feeling.title
          }
        });
      }

      item = await Feeling.deleteById(id);

      return item;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

}
