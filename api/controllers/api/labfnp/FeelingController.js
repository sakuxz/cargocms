module.exports = {

  find: async (req, res) => {
      try {
        let {query} = req
        let {serverSidePaging} = query

        if(serverSidePaging){

          const findQuery = FormatService.getQueryObj(query);
          let result = await Feeling.findAndCountAll(findQuery)
          let data = result.rows
          let recordsTotal = data.length
          let recordsFiltered =  result.count
          let draw = parseInt(req.draw) + 1

          let user = AuthService.getSessionUser(req);
          if (user) {
            let userFeeling = await UserFeeling.findAll({
              where: {
                scentName: query.search.value,
                UserId: user.id,
              }
            });
            data = userFeeling.concat(data);
          }

          res.ok({draw, recordsTotal, recordsFiltered, data});
        }else {
          const feelings = await Feeling.findAll();
          res.ok({
            data: {
              items: feelings
          }});
        }
      } catch (e) {
        res.serverError({ message: e, data: {}});
      }
    },

  findOne: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Feeling.findOne({id})
      res.ok({data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  },

  create: async (req, res) => {
    try {
      const data = req.body;
      const item = await Feeling.create(data);
      let message = 'Create success.';
      res.ok({ message, data: { item } } );
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const message = 'Update success.';
      const item = await Feeling.update(data ,{
        where: { id, },
      });
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Feeling.deleteById(id);
      let message = 'Delete success';
      res.ok({message, data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  }
}
