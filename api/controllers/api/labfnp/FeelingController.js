module.exports = {

  async findByUser(req, res) {
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

  async getAllWithAllScents(req, res) {
    sails.log.info('=== FeelingController getAllWithAllScents ===');
    try {
      // 取出全部的感覺並格式化，而且不要群組
      // const feelingCount = await Feeling.count();
      // console.log('feelingCount=>', feelingCount)
      const feelings = (await Feeling.findAll({
        attributes: ['title', 'scentName'],
      }))
        .sort(() => (0.5 - Math.random()))
        .slice(0, 200)
        .map(e => ({
          title: e.title,
          scentName: e.scentName,
        }));
        // console.log('feelings=>', feelings)
      console.log('feelings.length=>', feelings.length)
      let feelingArray = [];

      // 取出已登入的使用者的感覺
      const user = AuthService.getSessionUser(req);
      if (user) {
        let scentFeedback = await ScentFeedback.findAll({
          where: { UserId: user.id },
          include: [Scent],
        });
        scentFeedback = scentFeedback.map(feedback => ({
          title: feedback.feeling,
          scentName: feedback.Scent.name,
        }));
        feelingArray = scentFeedback.concat(feelings);
      } else feelingArray = feelings;

      const result = [];
      // 取出全部的氣味分子
      const scentObjs = await Scent.findAll({
        attributes: {
          exclude: [
            'feelings',
            'createdAt',
            'updatedAt'],
        },
      });

      // 由氣味分子名稱查出對應的氣味分子資料，並且塞回 array
      let count = 18;
      for (const item of feelingArray) {
        const scents = feelingArray
          .filter(g => g.title === item.title)
          .map(f => f.scentName);
        console.log('scents=>', scents)
        let scentObjArray = [];
        // 取出氣味分子資料
        scents.forEach((s) => {
          const arr = scentObjs
            .filter(obj => obj.name.toString() === s.toString())
            .map(obj => ({
              id: obj.id,
              name: obj.name,
              title: obj.title,
              sequence: obj.sequence,
              ScentNoteId: obj.ScentNoteId,
              description: obj.description,
            }));
          scentObjArray = scentObjArray.concat(arr);
        });
        count -= 1;
        if (count <= 0) break;
        result.push({
          feeling: item.title,
          scents: scentObjArray,
        });
      }
      return res.ok({
        success: true,
        data: {
          items: result,
          length: result.length,
        },
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
};
