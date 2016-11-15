module.exports = {
  findAll: async () => {
    try {
      return await User.findAll();
    } catch (e) {
      throw e;
    }
  },

  create: async (recipe = {
    formula,
    formulaLogs,
    authorName,
    perfumeName,
    message,
    description,
    visibility,
    UserId,
    coverPhotoId,
    authorFbPage,
    createdBy,
  }) => {
    try {
      recipe.formula = RecipeService.sortFormulaByScentName({ formula: recipe.formula });
      recipe.coverPhotoId = recipe.coverPhotoId == "" ? null : recipe.coverPhotoId;

      return await Recipe.create(recipe);
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  sortFormulaByScentName: ({formula}) => {
    const bubble = (a, b) => a.scent.match(/(\d+)/g)[0]-b.scent.match(/(\d+)/g)[0];
    let result = formula.sort(bubble);
    return result;
  },

  sortFeelingsByValue: ({feelings}) => {
    console.log(feelings[0]);
    const bubble = (a, b) => parseInt(b.value, 10)-parseInt(a.value, 10);
    let result = feelings.sort(bubble);
    return result;
  },

  update: async (recipe = {
    id,
    formula,
    formulaLogs,
    authorName,
    perfumeName,
    message,
    description,
    visibility,
    coverPhotoId,
  }) => {
    try {
      const bubble = (a,b) => a.scent.match(/(\d+)/g)[0]-b.scent.match(/(\d+)/g)[0];
      recipe.formula = recipe.formula.sort(bubble);
      sails.log.info('update recipe service=>', recipe);
      let updatedRecipe = await Recipe.findOne({
        where: {
          id: parseInt(recipe.id, 10)
        },
      });
      if (updatedRecipe) {
        updatedRecipe.formula = recipe.formula;
        updatedRecipe.formulaLogs = recipe.formulaLogs;
        updatedRecipe.authorName = recipe.authorName;
        updatedRecipe.perfumeName = recipe.perfumeName;
        updatedRecipe.message = recipe.message;
        updatedRecipe.visibility = recipe.visibility;
        updatedRecipe.description = recipe.description;
        updatedRecipe.coverPhotoId = recipe.coverPhotoId == "" ? updatedRecipe.coverPhotoId : recipe.coverPhotoId;

        updatedRecipe = await updatedRecipe.save();
      }
      return updatedRecipe;
    } catch (e) {
      throw e;
    }
  },

  loadRecipe: async function(recipeId, currentUser, isAdmin) {
    try {
      const recipe = await Recipe.findOne({
        where: { $or: [{ id: recipeId }, {hashId: recipeId}] },
        include: [{
          model: UserLikeRecipe
        }, {
          model: Image,
        }, {
          model: User,
          include: {
            model: Passport,
            attributes: ['provider', 'identifier']
          },
        }]
      })

      if (!recipe) {
        let error = new Error('can not find recipe');
        error.type = 'notFound';
        throw error;
      }
      recipeId = recipe.id;
      recipe.label = '精選';
      if (recipe.visibility === 'PRIVATE' && !isAdmin){
        recipe.label = '非公開';
        if (!currentUser || recipe.UserId !== currentUser.id)
          recipe.formula = [];
      }
      await recipe.checkCurrentUserLike({currentUser})

      let editable = false;
      let userId = null;
      if(currentUser != null && currentUser.id) userId = currentUser.id;

      const belongUser = recipe.UserId === userId;
      if (currentUser && belongUser) editable = true;

      const social = SocialService.forRecipe({ recipes: [recipe] });

      const RecipeId = recipe.id
      const UserId = userId
      let recipeFeedback = await RecipeFeedback.findOne({where: {RecipeId, UserId}})
      if(recipeFeedback == null)
        recipeFeedback = RecipeFeedback.build();

      let recipeOrder = await RecipeOrder.findOne({where: {RecipeId, UserId}})

      if(recipeOrder != null){
        recipeFeedback.invoiceNo = recipeOrder.invoiceNo;
        let RecipeOrderId = recipeOrder.id;
        let allpay = await Allpay.findOne({where: {RecipeOrderId}})
        if(allpay != null)
          recipeFeedback.tradeNo = allpay.TradeNo
      }

      return { recipe, editable, social, recipeFeedback};
    } catch (e) {
      throw e;
    }
  },

  createUserFeeling: async function({formula, userId}) {
    try {
      let userFeeling = [];
      for (let item of formula) {
        if (!item.userFeeling) continue;
        const scent = await Scent.findOne({ where: { name: item.scent } });
        let data = item.userFeeling.map((word) => {
          return {
            feeling: word,
            // scentName: item.scent,
            ScentId: scent.id,
            UserId: userId,
          }
        });
        userFeeling = userFeeling.concat(data);
      }
      sails.log.info(userFeeling);
      await ScentFeedback.bulkCreate(userFeeling);
    } catch (e) {
      throw e
    }
  },

  getUserFeeling: async function({userId}) {
    try {
      let scentFeeling = {};
      let allUserScentFeedback = await ScentFeedback.findAll({
        where: {
          UserId: userId
        },
        include: {
          model: Scent,
          include: ScentNote
        }
      });
      allUserScentFeedback.forEach((feedback) => {
        let key = feedback.Scent.name;
        feedback = feedback.toJSON();
        scentFeeling[key] = scentFeeling[key] || {...feedback};
        scentFeeling[key].info = scentFeeling[key].info || [];
        scentFeeling[key].info.push(feedback.feeling);
      })
      Object.keys(scentFeeling).map((key) => {
        scentFeeling[key].feeling = scentFeeling[key].info.join(',');
      });
      return scentFeeling;
    } catch (e) {
      throw e
    }
  },

  getUserRecipeFeeling: async function({userId}) {
    try{
      let recipeFeeling = {};

      let allUserRecipeFeedback = await RecipeFeedback.findAll({
        where: {
          UserId: userId
        },
        include: {
          model: Recipe,
          include: [ Image ],
        }
      });
      allUserRecipeFeedback.forEach( (feedback) => {
        let key = feedback.Recipe.perfumeName;
        feedback = feedback.toJSON();
        recipeFeeling[key] = recipeFeeling[key] || {...feedback};
        recipeFeeling[key].info = recipeFeeling[key].info || [];

        feedback.feeling.forEach((feel) => {
          recipeFeeling[key].info.push(feel);
        })

      });
      Object.keys(recipeFeeling).map((key) => {
        recipeFeeling[key].feeling = recipeFeeling[key].info.join(',');
      });

      return recipeFeeling;
    } catch (e) {
      throw e;
    }
  },

  updateUserFeeling: async function({formula, userId}) {
    try {
      let deleteAdj = [];
      let createNewAdj = [];
      for (let item of formula) {
        const scent = await Scent.findOne({ where: { name: item.scent } });
        if (item.userFeeling && item.userFeeling.length > 0) {
          console.log(item.scent, item.userFeeling);
          deleteAdj.push(
            ScentFeedback.destroy({
              where: {
                UserId: userId,
                ScentId: scent.id,
                feeling: { $notIn: item.userFeeling }
              }
            })
          );
          item.userFeeling.forEach((adj) => {
            createNewAdj.push(
              ScentFeedback.findOrCreate({
                where: {
                  feeling: adj,
                  ScentId: scent.id,
                  UserId: userId,
                },
                defaults: {
                  feeling: adj,
                  ScentId: scent.id,
                  UserId: userId,
                }
              })
            );
          });
        } else {
          deleteAdj.push(
            ScentFeedback.destroy({
              where: {
                UserId: userId,
                ScentId: scent.id,
              }
            })
          );
        }
      }
      await Promise.all(deleteAdj);
      await Promise.all(createNewAdj);

    } catch (e) {
      throw e;
    }
  }

}
