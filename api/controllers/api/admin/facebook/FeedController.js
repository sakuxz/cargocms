module.exports = {
  find: async (req, res) => {
    try {
      const { query } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      let result;
      if (serverSidePaging) {
        result = await PagingService.process({ query, modelName });
      } else {
        const items = await sails.models[modelName].findAll({where: {
          type: {
            "$ne": "status"
          }
        }});
        result = { data: { items } };
      }
      res.ok(result);
    } catch (e) {
      res.serverError(e);
    }
  },
  import: async (req, res) => {
    try {
      await FacebookService.feedsImport();
      let data = {success: true}
      res.ok({data});
    } catch (e) {
      res.serverError(e);
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {

      let feed = await Feed.findById(id);
      feed.publish = data.publish;
      await feed.save();

      res.ok({
        message: 'update success.',
        data: feed,
      });
    } catch (e) {
      res.serverError(e);
    }
  }
}
