module.exports = {

  find: async (req, res) => {
    try {
      const { serverSidePaging } = req.query;
      const query = req.body;
      const modelName = 'allpay'
      let result;
      if (serverSidePaging) {
        const include = {
          model: EventOrder,
          include: [User, Event]
        }
        result = await PagingService.process({ query, modelName, include });
      } else {
        const items = await sails.models[modelName].findAll({
          include:{
            model: EventOrder,
            include: [User, Event]
          }
        });
        result = { data: { items } };
      }
      res.ok(result);
    } catch (e) {
      res.serverError(e);
    }
  },

  findOne: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Allpay.findOne({
        where:{
          id
        },
        include:{
          model: EventOrder,
          include: [User, Event]
        }
       });
      res.ok({ data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

}
