module.exports = {
  index: async (req, res) => {
    res.ok({
      view: true,
      layout: '../../admin/default/index'
    });
  },
  create: async (req, res) => {
    res.ok({
      view: true,
      layout: '../admin/default/index'
    });
  },
  edit: async (req, res) => {
    res.ok({
      view: true,
      layout: '../admin/default/index'
    });
  },
  show: async (req, res) => {
    res.ok({
      view: true,
      layout: '../admin/default/index'
    });
  },
};
