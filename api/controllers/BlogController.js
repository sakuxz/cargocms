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
}
