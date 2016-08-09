module.exports = {

  create: async (req, res) => {
    const data = req.body;
    try {
      const slogan = await Slogan.create(data);
      res.ok({
        message: 'create slogan success',
        data: slogan,
      });
    } catch (e) {
      res.serverError({ message: e.message, data: {}});
    }
  }
}
