module.exports = {
  findAll: async () => {
    try {
      return await User.findAll();
    } catch (e) {
      throw e;
    }
  },

  create: async ({
    formula,
    formulaLogs,
    authorName,
    perfumeName,
    UserId
  }) => {
    try {
      sails.log.info({
        formula,
        formulaLogs,
        authorName,
        perfumeName,
        UserId,
      });
      return await Recipe.create({ formula, formulaLogs, authorName, perfumeName, UserId });
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  update: async (recipe = {
    id,
    formula,
    formulaLogs,
    authorName,
    perfumeName,
  }) => {
    try {
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

        updatedRecipe = await updatedRecipe.save();
      }
      return updatedRecipe;
    } catch (e) {
      throw e;
    }
  },
}
