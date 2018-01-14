describe('about tracer operation.', () => {

  it('custom log', (done) => {
    sails.log.info('info!!!!!!!!!!!');
    sails.log.warn('warn!!!!!!!!!!!');
    sails.log.verbose('verbose!!!!!!!!!!!');
    sails.log.silly('silly!!!!!!!!!!!');
    sails.log.error('error!!!!!!!!!!!');
    done()
  });

  it('error', (done) => {
    try {
      throw new Error('Hello Error!');
    } catch (e) {
      console.log(e);
      sails.log.error(e);
      done()
    }
  });

  it('error', (done) => {
    try {
      a = '測試error';
    } catch (e) {
      console.log(e);
      sails.log.error(e);
      done()
    }
  });

});
