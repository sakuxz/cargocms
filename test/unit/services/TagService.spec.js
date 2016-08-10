describe('about Tag Service operation.', function() {

  describe('add Tag to Post', () => {
    let tagsIds;
    let targetPost;
    before(async (done) => {
      try {
        targetPost = await Post.create({
          title: '香味的一沙一世界4',
          content: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材（ex:玫瑰、康乃馨..等)所組成的『這束花的味道』，接著抽出其中的一朵康乃馨',
          url: 'http://localhost:5001/blog/flower',
          abstract: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材',
        })
        done();
      } catch (e) {
        done(e);
      }
    });
    it('add to Post should success.', async (done) => {
      try {
        const datas = [ 'A', 'B' ];
        const result = await TagService.updateOrCreate({
          postId: targetPost.id,
          datas,
        });
        result[0].title.should.be.eq(datas[0]);
        result[1].title.should.be.eq(datas[1]);
        done()
      } catch (e) {
        done(e)
      }
    });
  });

  describe('update Tag to Post', () => {
    let targetPost;
    before(async (done) => {
      try {
        targetPost = await Post.create({
          title: '香味的一沙一世界5',
          content: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材（ex:玫瑰、康乃馨..等)所組成的『這束花的味道』，接著抽出其中的一朵康乃馨',
          url: 'http://localhost:5001/blog/flower',
          abstract: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材',
        })
        const datas = [ 'A', 'B' ];
        await TagService.updateOrCreate({
          postId: targetPost.id,
          datas,
        });
        done();
      } catch (e) {
        done(e);
      }
    });
    it('update Post tags should success.', async (done) => {
      try {
        const datas = [ 'A', 'C' ];
        const result = await TagService.updateOrCreate({
          postId: targetPost.id,
          datas,
        });
        result[0].title.should.be.eq(datas[0]);
        result[1].title.should.be.eq(datas[1]);
        done()
      } catch (e) {
        done(e)
      }
    });
  });


});
