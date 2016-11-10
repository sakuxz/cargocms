module.exports = {

  index: async (req, res) => {
    try {
      const {type} = req.query
      const order = 'DESC';
      let where = {
        type: "blog"
      }


      const posts = await Post.findAllHasJoin({order, where});
      const social = SocialService.forPost({posts});
      const items = posts;
      const data = {items}
      res.view('blog/index', {data, social});
    } catch (e) {
      res.serverError(e);
    }
  },

  show: async (req, res) => {
    try {
      const {id, name} = req.params
      let data = await Post.findOne({
        where: { $or: [{ id: id || name }, { alias: name }] },
        include: [ Tag, Image, User, Location]
      });

      if(!data){
        sails.log.error(`Post ID or Name: ${id || name}, data not found.`);
        return res.notFound();
      }
      const social = SocialService.forPost({posts: [data]});
      res.view('blog/show', {data, social});
    } catch (e) {
      res.serverError(e);
    }
  },
}
