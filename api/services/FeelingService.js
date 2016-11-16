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

      if (sameTitle){
        let newTotalRepeat = ( Number(sameTitle.totalRepeat) + 1).toString();

        sameTitle = await Feeling.update({
          totalRepeat: newTotalRepeat
        },{
          where:{
            title: data.title
          }
        });

        data.totalRepeat = newTotalRepeat;
      }

      item = await Feeling.create(data);

      await ScentService.updateByFeeling(data);

      return item;
    }
    catch(e){
      sails.log.error(e);
      throw e;
    }
  },

  update: async ( id , data ) => {
    try{
      let oldFeeling = await Feeling.findById(id);
      let item;
      const needDeleteScentKey = oldFeeling.title;
      const newFeelingTitle = data.title;
      const newFeelingScore = data.score;

      if( oldFeeling.title !== newFeelingTitle ){

        if(oldFeeling.totalRepeat > 1){
          let oldTitleNewTotalRepeat = (Number(oldFeeling.totalRepeat) - 1).toString();
          await Feeling.update({
            totalRepeat: oldTitleNewTotalRepeat
          },{
            where:{
              title: oldFeeling.title
            }
          });
        }

        let newTitleTotalRepeat = await Feeling.findOne({ where:{ title: newFeelingTitle }});
        if(newTitleTotalRepeat){
          newTitleTotalRepeat = (Number(newTitleTotalRepeat.totalRepeat) + 1).toString();
        } else {
          newTitleTotalRepeat = "1";
        }

        oldFeeling.title = newFeelingTitle;
        oldFeeling.score = newFeelingScore;
        item = await oldFeeling.save();

        await Feeling.update({
          totalRepeat: newTitleTotalRepeat
        },{
          where:{
            title: item.title
          }
        });

      } else if( oldFeeling.score !== newFeelingScore) {
        oldFeeling.score = newFeelingScore;
        item = await oldFeeling.save();
      } else {
        item = oldFeeling;
      }

      await ScentService.deleteByFeeling( oldFeeling.scentName, needDeleteScentKey);
      await ScentService.updateByFeeling( item );

      return item;

    } catch (e){
      sails.log.error(e);
      throw e;
    }
  },

  destroy: async ( id ) => {
    try{
      let item, scent;
      let feeling = await Feeling.findById(id);

      await ScentService.deleteByFeeling(feeling.scentName , feeling.title);

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
