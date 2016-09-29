module.exports = {

  findForLab: async (req, res) => {
    console.log("=== findForLab ===");
    try {
      let user = AuthService.getSessionUser(req);
      const recipes = await Recipe.findAndIncludeUserLike({
        currentUser: user,
        start: parseInt(req.query.start, 10) || 0,
        length: parseInt(req.query.length, 10) || 5,
      });
      console.log();
      let social = SocialService.forRecipe({recipes});
      res.ok({
        data: {
          items: recipes,
          social,
        }
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  find: async (req, res) => {
    try {
      const { query } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      let result;
      if (serverSidePaging) {
        result = await PagingService.process({query, modelName});
      } else {
        const items = await sails.models[modelName].findAll();
        result = { data: { items } };
      }
      res.ok(result);
    } catch (e) {
      res.serverError(e);
    }
  },

  findOne: async (req, res) => {
    const { id } = req.params;
    try {
      const recipe = await Recipe.findOneWithScent({id})
      sails.log.info('get recipe =>', recipe);
      res.ok({
        message: 'Get recipe success.',
        data: {item: recipe},
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  create: async (req, res) => {
    const data = req.body;
    try {
      const loginedUser = AuthService.getSessionUser(req);
      if (loginedUser) {
        data.UserId = loginedUser.id;
      }
      sails.log.info('create recipe controller=>', data);
      const recipe = await RecipeService.create(data);
      res.ok({
        message: 'Create recipe success.',
        data: recipe,
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      sails.log.info('update recipe controller id=>', id);
      sails.log.info('update recipe controller data=>', data);
      const recipe = await RecipeService.update({
        id: id,
        ...data,
      });
      res.ok({
        message: 'Update recipe success.',
        data: recipe,
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      sails.log.info('delete recipe controller=>', id);
      const userId = AuthService.getSessionUser(req).id;
      const recipe = await Recipe.deleteById(id);
      res.ok({
        message: 'Delete recipe success.',
        data: {
          userId
        },

      });
    } catch (e) {
      res.serverError(e);
    }
  },

  like: async(req, res) => {
    try {
      const { id } = req.params;
      const loginUser = AuthService.getSessionUser(req);
      if (!loginUser) throw Error('permission denied');
      const recipe = await Recipe.findById(id);
      await UserLikeRecipe.createIfNotExist({RecipeId: id, UserId: loginUser.id})

      res.ok({
        message: 'success like recipe',
        data: true,
      });
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  unlike: async (req, res) => {
    try {
      const { id } = req.params;
      const loginUser = AuthService.getSessionUser(req);
      if (!loginUser) throw Error('permission denied');

      const recipe = await Recipe.findById(id);
      await UserLikeRecipe.destroy({
        where: {RecipeId: id, UserId: loginUser.id}
      })
      res.ok({
        message: 'success dislike recipe',
        data: true,
      });
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  feelings: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("=== id ===", id);

      const feelings = await Recipe.getFeelings({id});

      res.ok({
        message: 'success get recipe\'s feelings',
        data: {feelings},
      });

    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  topNew: async (req, res) => {
    try {
      const recipes = await Recipe.findAll({
        where: { visibility: { $not: 'PRIVATE' } },
        offset: 0,
        limit: 3,
      });
      res.ok({
        message: 'success get new recipe',
        data: { recipes },
      });
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  saveFeedback: async (req, res) => {
    const data = req.body;
    try {
      if (typeof data.feeling === 'string'){
        data.feeling = [data.feeling];
      }
      let {UserId, RecipeId} = data;
      let feedback = await RecipeFeedback.findOne({where: {UserId, RecipeId}});

      if(feedback != null){
        feedback.invoiceNo = data.invoiceNo
        feedback.tradeNo = data.tradeNo
        feedback.feeling = data.feeling
        feedback = await feedback.save(data);
      }else {
        feedback = await RecipeFeedback.create(data);
      }

      res.ok({
        message: 'save feedback success.',
        data: feedback,
      });
    } catch (e) {
      res.serverError(e);
    }
  },

}
