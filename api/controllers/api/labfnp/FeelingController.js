module.exports = {

  findByUser: async (req, res) => {
    try {
      const user = AuthService.getSessionUser(req);
      let scentItem = [];
      let recipeItem = [];
      if (user) {
        scentItem = await RecipeService.getUserFeeling({ userId: user.id });
        recipeItem = await RecipeService.getUserRecipeFeeling({ userId: user.id });
      }
      const message = 'find user feeling';
      return res.ok({
        success: true,
        message,
        data: { scentItem, recipeItem },
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  async getAll(req, res) {
    sails.log.info('=== FeelingController getAll ===');
    try {
      const feelings = await Feeling.findAll({
        attributes: ['title', 'scentName'],
        group: ['Feeling.title'],
      });
      const ramdomFeelings = feelings.sort(() => (0.5 - Math.random())).map(e => ({
        title: e.title,
        scentName: e.scentName,
      }));
      const user = AuthService.getSessionUser(req);
      let feelingArray = [];
      if (user) {
        let scentFeedback = await ScentFeedback.findAll({
          where: {
            UserId: user.id,
          },
          include: [Scent],
        });
        scentFeedback = scentFeedback.map(feedback => ({
          title: feedback.feeling,
          scentName: feedback.Scent.name,
        }));
        feelingArray = scentFeedback.concat(ramdomFeelings);
      } else feelingArray = ramdomFeelings;
      return res.ok({
        success: true,
        data: {
          items: feelingArray,
        },
      });
    } catch (e) {
      return res.serverError(e);
    }
  },

};
