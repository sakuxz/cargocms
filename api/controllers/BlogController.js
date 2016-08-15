module.exports = {
  index: async (req, res) => {
    try {

      res.view('blog/index', {
        message: 'blog index',
        data: {
          items: await Post.findAllHasJoin('DESC'),
        }
      });
    } catch (e) {
      res.serverError(e);
    }
  },
  show: async (req, res) => {
    try {
      res.view('blog/show', {
        message: 'blog index',
        data: await Post.findByIdHasJoin(req.params.id),
      });
    } catch (e) {
      res.serverError(e);
    }
  },
}
