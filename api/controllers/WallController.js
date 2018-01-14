module.exports = {
  index: async (req, res) => {
    try {

      let feeds = await Feed.findAll({
        where: {
          publish: true
        },
        order: [['createdAt', 'DESC']],
      });

      let quotes = await Quote.findAll({
        where:{
          type: 'quote'
        },
        limit: 5,
        order: [['createdAt', 'DESC']],
        include:{
          model: Image
        }
      })

      if (req.wantsJSON) {
        return res.json(feeds);
      }
      else {
        res.view({
          feeds,
          quotes
        });
      }
    } catch (e) {
      res.serverError(e);
    }
  },
  show: async (req, res) => {
    try {
      const sourceId = req.params.id;
      let feed = await Feed.findOne({
        where: { sourceId },
      });


      if (!feed) {
        return res.notFound();
      } else {
        let createdTime = new Date(feed.createdAt);
        createdTime = createdTime.getTime();
        let now = new Date();
        now = now.getTime();
        var days = (now - createdTime)/1000/60/60/24;
        if (days > 100) {
          let getNowFeed = await FacebookService.getFeed(sourceId);
          if(getNowFeed) {
            feed.fullPicture = getNowFeed.full_picture;
          }
        }
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
