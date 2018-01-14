module.exports.init = async () => {
  try {
    const isDevMode = sails.config.environment === 'development';
    const isDropMode = sails.config.models.migrate == 'drop';

    if (isDevMode && isDropMode) {

      let post = await Post.create({
        title: '建立自己的網誌',
        content: '人人都是部落客',
        coverUrl: 'http://www.theblogstarter.com/wp-content/uploads/2016/01/start-your-blog-4-steps.png',
        url: 'http://localhost:5001/blog/flower',
        abstract: '部落客一生一世'
      });

      const tag = await Tag.create({
        title: 'blog'
      });

      await post.addTag(tag.id);
    }
  } catch (e) {
    console.error(e);
  }
};
