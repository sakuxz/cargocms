module.exports = {

  index: async (req, res) => {
    try {
      const { type } = req.query;
      const order = 'DESC';
      const where = {
        publish: true,
        type: 'blog',
      };

      const posts = await Post.findAllHasJoin({ order, where });

      const social = SocialService.forPost(posts);
      const items = posts;
      const data = { items };
      return res.view('blog/index', { data, social });
    } catch (e) {
      return res.serverError(e);
    }
  },

  show: async (req, res) => {
    try {
      const { id, name } = req.params;
      const data = await Post.findOne({
        where: { $or: [{ id: id || name }, { alias: name }] },
        include: [Tag, Image, User, Location],
      });

      if (!data || !data.publish) {
        sails.log.error(`Post ID or Name: ${id || name}, data not found or not publish.`);
        return res.notFound();
      }
      const social = SocialService.forPost([data]);
      return res.view('blog/show', { data, social });
    } catch (e) {
      return res.serverError(e);
    }
  },
};
