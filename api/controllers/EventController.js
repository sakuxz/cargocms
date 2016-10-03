module.exports = {

  index: async (req, res) => {
    try {
      const {type} = req.query
      const order = 'DESC';
      let where = {
        type: ["internal-event", "external-event"]
      }

      const posts = await Post.findAllHasJoin({order, where});
      const social = SocialService.forPost({posts});
      const items = posts;
      const data = {items}

      res.view('event/index', {data, social});
    } catch (e) {
      res.serverError(e);
    }
  },

  show: async (req, res) => {
    try {
      const {id} = req.params
      let data = await Post.findByIdHasJoinByEvent({id});
      console.log("==== data ====", data);
      const social = SocialService.forPost({posts: [data]});
      res.view('event/show', {data, social});
    } catch (e) {
      res.serverError(e);
    }
  }
}
