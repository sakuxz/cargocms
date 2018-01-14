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


      let popularPost = await Post.findOne({
        include: [
          {
            model: Event,
            where: {
              eventEndDate: {
                gt: new Date(),
              },
            },
          },
          { model: Image },
        ],
        order: [
          [{ model: Event }, 'signupCount', 'DESC'],
        ],
      });
      //
      if (!popularPost) {
        sails.log('all popular Post are end, so find the most popular one in the past for instead.');
        popularPost = await Post.findOne({
          include: [Event, Image],
          order: [
            [{ model: Event }, 'signupCount', 'DESC'],
          ],
        });
      }

      const chosenPosts = await Post.findOne({
        where: { chosen: true },
        include: [
          { model: Event },
          { model: Image },
        ],
        order: [['updatedAt', 'DESC']],
      });

      const popular = popularPost || posts[posts.length - 1];
      const chosen = chosenPosts ? chosenPosts.toJSON() : posts[posts.length - 2];

      return {
        popular,
        chosen,
        allposts: posts,
      };
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },
};

