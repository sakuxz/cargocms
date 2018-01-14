module.exports = {
  updateOrCreate: async function({postId, datas = []}) {
    try {
      const post = await Post.findById(postId);
      let originTags = await post.getTags();
      originTags = originTags.map(tag => tag.id);
      if (originTags.length > 0) {
        await post.removeTags(originTags);
      }

      const tags = [];
      for (let title of datas) {
        const findOrCreate = await Tag.findOrCreate({
          where: { title },
          defaults: { title },
        });
        tags.push(findOrCreate[0]);
      }
      const tagIds = tags.map(tag => tag.id);
      await post.addTags(tagIds);
      return tags.map(tag => {
        return {
          id: tag.id,
          title: tag.title,
        }
      });
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },
}
