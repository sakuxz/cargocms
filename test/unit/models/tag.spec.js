describe('about Tag model operation.', function() {
  let targetPost;
  let tag;
  before(async (done) => {
    try {
      const image = await Image.create({
        filePath: 'http://www.labfnp.com/modules/core/img/update1.jpg',
        type: 'image/jpeg',
        storage: 'url',
      });
      targetPost = await Post.create({
        title: '1213',
        content: '1213',
        category: '1213',
        cover: image.id,
        url: '1213',
        abstract: '1213',
      })
      tag = await Tag.create({
        title: 'A'
      });
      done();
    } catch (e) {
      done(e);
    }
  });

  it('create Tag should success.', async (done) => {
    try {
      await targetPost.addTag(tag.id);
      done();
    } catch (e) {
      done(e);
    }
  });
});
