module.exports = {
  scentUpdatebyFeedback: async ( data ) => {
    try{
      let item;
      let feeling = await Feeling.findOne({
        where:{
          scentName: data.scentName,
          title: data.feeling
        }
      })

      if(!feeling){

        item = await FeelingService.create({
          title: data.feeling,
          scentName: data.scentName
        });

      } else {

        feeling.score = ( Number(feeling.score) + 1 ).toString();
        feeling = await feeling.save();
        item  = ScentService.updateByFeeling( feeling );

      }

      return item;

    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  updateByFeeling: async ( data ) => {
    try{
      let scent = await Scent.findOne({
        where: { name: data.scentName }
      });
      let feelings = scent.feelings;
      let match = false;
      for(let i = 0 , len = feelings.length; i < len; i++){
        if(feelings[i].key === data.title){
          feelings[i] = {
            key: data.title,
            value: data.score
          };
          match = true;
          break;
        }
      }
      if(!match){
        feelings.push({key: data.title, value: data.score});
      }
      scent.feelings = feelings;
      const item = await scent.save();

      return item;

    } catch (e){
      sails.log.error(e);
      throw e;
    }
  },

  deleteByFeeling: async ( scentName, key) => {
    try{
      let scent = await Scent.findOne({
        where:{
          name: scentName
        }
      });

      let scentFeelings = scent.feelings;
      for(let i = 0, len = scentFeelings.length; i < len; i++){
        if(scentFeelings[i].key === key ){
          scentFeelings.splice( i , 1);
          break;
        }
      }
      scent.feelings = scentFeelings;
      await scent.save();

    } catch (e){
      sails.log.error(e);
      throw e;
    }
  }
}
