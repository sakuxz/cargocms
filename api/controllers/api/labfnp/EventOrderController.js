module.exports = {
  find: async (req, res) => {
    try {
      let user = AuthService.getSessionUser(req);
      const message = 'get order success.';
      const item = await Allpay.findAll({
        include: {
          model: EventOrder,
          where: { UserId: user.id },
          include: [
            {
              model: Event,
              include: [ {model: Post } ]
            }
          ]
        },
        order: [['createdAt', 'DESC']],
      });
      sails.log.debug(item);
      res.ok({ message, data: { item }});
    } catch (e) {
      res.serverError(e);
    }
  }
}
