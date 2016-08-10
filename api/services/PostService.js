module.exports = {
  create: async function ({ title,  content,  cover = null,  url,  abstract, UserId }) {
    try {
      return await Post.create({
        title,
        content,
        cover: cover === '' ? null : cover,
        url,
        abstract,
        UserId
      });
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  update: async function (postId, { title,  content,  cover,  url,  abstract, TagsArray }) {
    try {
      await Post.update({
        title,
        content,
        cover: cover === '' ? null : cover,
        url,
        abstract
      }, {
        where: {
          id: postId,
        }
      });
      await TagService.updateOrCreate({
        postId,
        datas: TagsArray
      });
      return true;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },
}
