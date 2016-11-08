module.exports = {

  find: async (req, res) => {
    try {
      const { query } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      let result;
      if (serverSidePaging) {
        const include = [Scent, User];
        result = await PagingService.process({query, modelName, include});
      } else {
        const items = await sails.models[modelName].findAll({
          include:[Scent, User]
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
      const item = await ScentFeedback.findOne({
        where:{
          id
        },
        include:[Scent, User]
       });
      res.ok({ data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await ScentFeedback.deleteById(id);
      const message = 'Delete success.';
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  feedbackCheck: async (req, res) => {
    try{
      const { id } = req.params;
      const data = req.body;

      await ScentService.scentUpdatebyFeedback(data);
      const item = await ScentFeedback.update({ feedbackCheck: true },{
        where: { id }
      });
      const message = 'Feedback Checked.';
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  }
}
