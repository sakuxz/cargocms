module.exports = {
  index: async (req, res) => {
    try {

      let feeds = await Feed.findAll({
        order: [['createdAt', 'DESC']],
      });

      if (req.wantsJSON) {
        return res.json(feeds);
      }
      else {
        res.view({
          feeds
        });
      }
    } catch (e) {
      res.serverError(e);
    }
  },
  show: async (req, res) => {
    try {

      let feed = await Feed.findOne({
        where: {
          sourceId: req.params.id,
        },
      });

      if (!feed) {
        return res.notFound();
      }

      if (req.wantsJSON) {
        return res.json(feed);
      }
      else {
        res.view({
          feed
        });
      }
    }
    catch (e) {
      res.serverError(e);
    }
  },
};
