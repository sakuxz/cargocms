import _ from 'lodash';

module.exports = {

  findForLab: async (req, res) => {
    console.log('=== findForLab ===');
    try {
      const user = AuthService.getSessionUser(req);
      const recipes = await Recipe.findAndIncludeUserLike({
        currentUser: user,
        start: parseInt(req.query.start, 10) || 0,
        length: parseInt(req.query.length, 10) || 5,
        likeUser: req.query.type === 'like' ? user : null,
      });
      const social = SocialService.forRecipe({ recipes });
      const formatItems = [];
      for (const item of recipes) {
        const newItem = JSON.parse(JSON.stringify(item));
        if (item.UserLikeRecipes && item.UserLikeRecipes.length > 0) {
          const isSessionUserLiked = item.UserLikeRecipes.filter(e => e.UserId === user.id);
          if (isSessionUserLiked.length > 0) {
            newItem.isFaved = true;
          } else newItem.isFaved = false;
        } else newItem.isFaved = false;
        formatItems.push(newItem);
      }
      return res.ok({
        data: {
          items: formatItems,
          social,
        },
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  findOne: async (req, res) => {
    const { id } = req.params;
    try {
      const currentUser = AuthService.getSessionUser(req);
      const isAdmin = AuthService.isAdmin(req);
      let recipe = {};
      try {
        recipe = await RecipeService.loadRecipe(id, currentUser, isAdmin);
      } catch (error) {
        if (error.message === 'can not find recipe') {
          return res.notFound({
            message: 'no recipe founded.',
            success: false,
          });
        }
      }
      let isFaved = false;
      if (recipe && recipe.UserLikeRecipes && recipe.UserLikeRecipes.length > 0) {
        const isSessionUserLiked = recipe.UserLikeRecipes.filter(e => e.UserId === currentUser.id);
        if (isSessionUserLiked.length > 0) {
          isFaved = true;
        } else isFaved = false;
      }
      sails.log.info('get recipe =>', recipe);
      return res.ok({
        message: 'Get recipe success.',
        data: {
          success: true,
          item: recipe,
          isFaved,
        },
      });
    } catch (e) {
      return res.serverError(e);
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
      if (!_.isArray(data.formula)) {
        throw new Error('required param formula as an array!');
      }
      const recipe = await RecipeService.create(data);
      await RecipeService.createUserFeeling({
        formula: data.formula,
        userId: loginedUser.id,
      });

      if (data.feedback && data.feedback.length > 0) {
        await RecipeFeedback.create({
          feeling: data.feedback,
          UserId: loginedUser.id,
          RecipeId: recipe.id,
        });
      }
      req.flash('info', 'Info.New.Recipe');
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
      const user = AuthService.getSessionUser(req);

      const recipe = await RecipeService.update({
        id,
        ...data,
      });

      await RecipeFeedback.update({
        feeling: data.feedback,
      }, {
        where: { UserId: user.id, RecipeId: id },
      });

      await RecipeService.updateUserFeeling({
        formula: data.formula,
        userId: user.id,
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
          userId,
        },

      });
    } catch (e) {
      res.serverError(e);
    }
  },

  like: async (req, res) => {
    try {
      const { id } = req.params;
      const loginUser = AuthService.getSessionUser(req);
      if (!loginUser) throw Error('permission denied');
      const recipe = await Recipe.findById(id);
      await UserLikeRecipe.createIfNotExist({ RecipeId: id, UserId: loginUser.id });

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
        where: { RecipeId: id, UserId: loginUser.id },
      });
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
      console.log('=== id ===', id);

      const feelings = await Recipe.getFeelings({ id });

      res.ok({
        message: 'success get recipe\'s feelings',
        data: { feelings },
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
        limit: 5,
        order: [['createdAt', 'DESC']],
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
      if (data.feeling !== '') {
        data.feeling = data.feeling.split(',');
        const { UserId, RecipeId } = data;
        let feedback = await RecipeFeedback.findOne({ where: { UserId, RecipeId } });

        if (feedback != null) {
          feedback.invoiceNo = data.invoiceNo;
          feedback.tradeNo = data.tradeNo;
          feedback.feeling = data.feeling;
          feedback = await feedback.save(data);
        } else {
          feedback = await RecipeFeedback.create(data);
        }
      }

      const updateformula = [];
      if (data.scentFeeling) {
        Object.keys(data.scentFeeling).forEach((key) => {
          if (data.scentFeeling[key]) {
            let feeling = data.scentFeeling[key].split(',') ;
            updateformula.push({
              scent: key,
              userFeeling: feeling,
            })
          } else {
            updateformula.push({
              scent: key,
              userFeeling: [],
            })
          }
        });
        const user = AuthService.getSessionUser(req);
        await RecipeService.updateUserFeeling({
          formula: updateformula,
          userId: user ? user.id : null,
        });
      }

      res.ok({
        message: 'save feedback success.',
        data: true,
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  async findUserRecipe(req, res) {
    sails.log('=== findMyRecipe ===');
    try {
      const {
        offset = 0,
        limit = 20,
      } = req.query;
      const { id } = req.params;
      console.log('findUserRecipe id=>', id);
      const currentUser = AuthService.getSessionUser(req);
      if (!currentUser) throw new Error('can not find user by giving user id `id` or not login yet.');
      const recipes = await Recipe.findAndIncludeUserLike({
        findByUserId: _.isNil(id) ? currentUser.id : id,
        currentUser,
        start: parseInt(offset),
        length: parseInt(limit),
        likeUser: null,
      });

      const formatItems = [];
      for (const item of recipes) {
        const newItem = JSON.parse(JSON.stringify(item));
        if (item.UserLikeRecipes && item.UserLikeRecipes.length > 0) {
          const isSessionUserLiked = item.UserLikeRecipes.filter(e => e.UserId === currentUser.id);
          if (isSessionUserLiked.length > 0) {
            newItem.isFaved = true;
          } else newItem.isFaved = false;
        } else newItem.isFaved = false;
        formatItems.push(newItem);
      }

      const message = 'get user recipes success';
      return res.ok({
        data: {
          recipes: formatItems,
        },
        message,
      });
    } catch (e) {
      sails.log.error(e);
      return res.negotiate(e);
    }
  },

  async findUserFavorite(req, res) {
    sails.log('=== findMyFavorite ===');
    try {
      const {
        offset = 0,
        limit = 20,
      } = req.query;
      const { id } = req.params;
      const currentUser = AuthService.getSessionUser(req);
      if (!currentUser) throw new Error('can not find user by giving user id `id`.');

      const findUser = (_.isNil(id)) ? (currentUser) : (await User.findById(id));
      const recipes = await Recipe.findAndIncludeUserLike({
        findByUserId: _.isNil(id) ? currentUser.id : id,
        currentUser,
        start: parseInt(offset) || 0,
        length: parseInt(limit) || 20,
        likeUser: findUser,
      });

      const formatItems = [];
      for (const item of recipes) {
        const newItem = JSON.parse(JSON.stringify(item));
        if (item.UserLikeRecipes && item.UserLikeRecipes.length > 0) {
          const isSessionUserLiked = item.UserLikeRecipes.filter(e => e.UserId === currentUser.id);
          if (isSessionUserLiked.length > 0) {
            newItem.isFaved = true;
          } else newItem.isFaved = false;
        } else newItem.isFaved = false;
        formatItems.push(newItem);
      }

      const message = 'get user favorite recipes success';
      return res.ok({
        data: {
          recipes: formatItems,
        },
        message,
      });
    } catch (e) {
      sails.log.error(e);
      return res.negotiate(e);
    }
  },

};
