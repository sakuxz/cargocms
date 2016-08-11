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
  },

  find: async (req, res) => {
    const data = req.body;
    try {
      const slogan = await Slogan.findAll();
      res.ok({
        message: 'find all slogan success',
        data: slogan,
      });
    } catch (e) {
      res.serverError({ message: e.message, data: {}});
    }
  },

  findOne: async (req, res) => {
    const data = req.body;
    try {
      const slogan = await Slogan.findById(req.params.id);
      res.ok({
        message: 'find one slogan success',
        data: slogan,
      });
    } catch (e) {
      res.serverError({ message: e.message, data: {}});
    }
  },

  update: async (req, res) => {
    const data = req.body;
    try {
      const slogan = await Slogan.update(req.body,{
        where: {
          id: req.params.id
        }
      });
      res.ok({
        message: 'update slogan success',
        data: slogan,
      });
    } catch (e) {
      res.serverError({ message: e.message, data: {}});
    }
  },

  destroy: async (req, res) => {
    const data = req.body;
    try {
      const slogan = await Slogan.destroy({
        where: {
          id: req.params.id
        }
      });
      res.ok({
        message: 'delete slogan success',
        data: slogan,
      });
    } catch (e) {
      res.serverError({ message: e.message, data: {}});
    }
  }
}
