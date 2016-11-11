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
            let scentFeedback = await ScentFeedback.findAll({
              where: {
                UserId: user.id,
              },
              include: {
                model: Scent,
                where: {
                  name: query.search.value,
                }
              }
            });
            data = data.map((info) => info.toJSON());
            scentFeedback = scentFeedback.map((info) => {
              info = info.toJSON();
              return {
                ...info,
                title: info.feeling
              }
            });
            data = scentFeedback.concat(data);
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
      let item = {};

      let sameTitle = await Feeling.findOne({
        where:{
          title: data.title
        }
      });

      data.totalRepeat = "1";
      data.score = "1";

      if (!sameTitle){
        item = await Feeling.create(data);
      } else {
        let newTotalRepeat = ( Number(sameTitle.totalRepeat) + 1).toString();

        sameTitle = await Feeling.update({
          totalRepeat: newTotalRepeat
        },{
          where:{
            title: data.title
          }
        });

        data.totalRepeat = newTotalRepeat;
        item = await Feeling.create(data);
      }

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
  },

  findByUser: async (req, res) => {
    try {
      let user = AuthService.getSessionUser(req);
      let scentItem =  [];
      let recipeItem = [];
      if (user) {
        scentItem = await RecipeService.getUserFeeling({ userId: user.id });
        recipeItem = await RecipeService.getUserRecipeFeeling({ userId: user.id });
      }
      let message = 'find user feeling';
      res.ok({message, data: {scentItem, recipeItem}});
    } catch (e) {
      res.serverError(e);
    }
  },
}
