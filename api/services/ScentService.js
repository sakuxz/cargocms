module.exports = {
  scentUpdatebyFeedback: async ( data ) => {
    try{
      let scent = await Scent.findOne({
        where: { name: data.scentName }
      });
      let feelings = scent.feelings;
      let match = false;
      for(let i = 0 , len = feelings.length; i < len; i++){
        if(feelings[i].key === data.feeling){
          feelings[i].value = ( Number(feelings[i].value) + 1 ).toString();
          match = true;
          break;
        }
      }
      if(!match){
        feelings.push({key: data.feeling, value: '1'});
      }
      scent.feelings = feelings;
      const item = await scent.save();
      return item;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },
}
