import moment from 'moment';
// import _ from 'lodash';

module.exports = {
  getTicketStatus: ({ sellStartDate, sellEndDate, limit, signupCount }, now) => {
    let open = false;
    let status = '';
    if (moment(now).isBefore(sellStartDate)) {
      open = false;
      status = '尚未開賣';
    } else if (moment(now).isAfter(sellEndDate) || limit <= signupCount) {
      open = false;
      status = '結束販售';
    } else {
      open = true;
      status = '訂購';
    }
    return { open, status };
  },

  async getEvent() {
    try {
      const order = 'DESC';
      const where = {
        publish: true,
        type: ['internal-event', 'external-event'],
      };
      const posts = await Post.findAllHasJoin({ order, where });


      const popularPosts = await Post.findAll({
        include: [
          {
            model: Event,
            where: {
              eventEndDate: {
                gt: new Date(new Date() - (60 * 24 * 60 * 60 * 1000)),
              },
            },
          },
          { model: Image },
        ],
        order: [
          [{ model: Event }, 'signupCount', 'DESC'],
        ],
      });

      const chosenPosts = await Post.findOne({
        where: { chosen: true },
        include: [
          { model: Event },
          { model: Image },
        ],
      });

      return {
        popular: popularPosts[0] || posts[posts.length - 1],
        chosen: chosenPosts || posts[posts.length - 2],
        allposts: posts,
      };
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },
};

