describe('about UtilsService.', function() {
  it('testing isMobile', async (done) => {
    try {
      let req = {
        headers: {
          "user-agent": ""
        }
      };
      
      // test iPhone
      req.headers['user-agent'] = "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25";
      UtilsService.isMobile(req).should.be.true;


      // test iPad
      req.headers['user-agent'] = "Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25";
      UtilsService.isMobile(req).should.be.false;

      // test desktop firefox 
      req.headers['user-agent'] = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0";
      UtilsService.isMobile(req).should.be.false;
      
      done();

    } catch (e) {
      done(e)
    }
  });

  it('testing isMobileForFineUpload', async (done) => {
    try {
      let req = {
        headers: {
          "user-agent": ""
        }
      };
      
      // test iPhone
      req.headers['user-agent'] = "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25";
      UtilsService.isMobileForFineUpload(req).should.be.true;


      // test iPad
      req.headers['user-agent'] = "Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25";
      UtilsService.isMobileForFineUpload(req).should.be.true;

      // test desktop firefox 
      req.headers['user-agent'] = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0";
      UtilsService.isMobileForFineUpload(req).should.be.false;
      
      done();

    } catch (e) {
      done(e)
    }
  });

});
