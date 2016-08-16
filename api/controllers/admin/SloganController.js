module.exports = {
  index: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/slogan/index'
    });
  },
  create: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/slogan/create'
    });
  },
  edit: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/slogan/edit'
    });

  },
  show: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/slogan/show'
    });
  },
}
