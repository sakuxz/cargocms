import _ from 'lodash';

module.exports = {

  async getAll(req, res) {
    sails.log.info('=== ScentController getAll ===');
    try {
      const scents = await Scent.findAllWithRelationFormatForApp();
      return res.ok({
        success: true,
        data: {
          items: scents,
        },
      });
    } catch (e) {
      return res.serverError(e);
    }
  },

  async findBy(req, res) {
    sails.log.info('=== ScentController findBy ===');
    try {
      const { name } = req.params;
      if (!name) {
        return res.notFound({ message: 'required parameter name.' });
      }
      const user = AuthService.getSessionUser(req);
      const scent = await Scent.find({
        where: { name },
        include: [ScentNote],
        order: 'sequence ASC',
      });
      if (!scent) {
        return res.ok({
          message: 'giving scent name not exists.',
          data: {},
          success: false,
        });
      }

      let data = await Scent.formatForApp({
        scents: [scent],
      });
      if (data && !_.isEmpty(data)) {
        data = data[0];
        if (user) {
          let feelingArray = [];
          let scentFeedback = await ScentFeedback.findAll({
            where: {
              UserId: user.id,
            },
            include: [Scent],
          });
          scentFeedback = scentFeedback.map(feedback => feedback.feeling);
          const scentFeeling = scent.feelings.map(e => e.key);
          feelingArray = scentFeedback.concat(scentFeeling);

          data.displayFeeling = feelingArray;
        }
      } else data = {};

      console.log('====================================');
      console.log('data=>', data);
      console.log('====================================');
      return res.ok({
        success: true,
        data: {
          items: data,
        },
      });
    } catch (e) {
      return res.serverError(e);
    }
  },

};
