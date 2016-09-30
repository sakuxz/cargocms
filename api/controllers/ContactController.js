module.exports = {
  index: async (req, res) => {
    try {
      const data = {};
      res.view('contact/index', {
        data: {
          user: AuthService.getSessionUser(req) || {},
          reCAPTCHAKey: sails.config.reCAPTCHA.key,
        }
      });
    } catch (e) {
      res.serverError(e);
    }
  },
  show: async (req, res) => {
    try {
      let data = await Post.findByIdHasJoin(req.params.id);
      const social = SocialService.forPost({posts: [data]});
      res.view('blog/show', {data, social});
    } catch (e) {
      res.serverError(e);
    }
  },
}
