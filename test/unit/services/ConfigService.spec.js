describe('about Config Service operation.', function() {

  before('測試用 config', async(done) => {
    try {
      await Config.create({
        name: 'appUrl',
        key: '',
        value: 'http://localhost:1338',
      });
      let a = await Config.create({
        name: 'test',
        key: 'key1',
        value: true,
        type: 'boolean',
      });
      done();
    } catch (e) {
      done(e);
    }
  })

  it('json 轉 model path', (done) => {
    try {
      const data = {
        bool: true,
        text: '123',
        array: [1, 2, 3],
        reCAPTCHA: {
          key: 'keykeykeykeykeykeykey',
          secret: 'secretsecretsecretsecretsecret',
        },
        passport: {
          facebook: {
            name: 'Facebook',
            protocol: 'oauth2',
            options: {
              clientID: 'testtesttesttesttesttest',
              clientSecret: 'testtesttesttesttesttest',
              callbackURL: "http://localhost:5001/auth/facebook/callback",
              scope: [ 'email', 'public_profile' ],
              profileFields: [
                'id', 'email', 'gender', 'link', 'locale',
                'name', 'timezone', 'updated_time', 'verified',
                'displayName', 'photos'
              ]
            }
          }
        }
      }
      const result = ConfigService.jsonTOPath(data);
      console.log(result);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('model path 轉 json', (done) => {
    try {
      const data = [ { name: 'bool', value: true, type: 'boolean' },
      { name: 'text', value: '123', type: 'text' },
      { name: 'array', value: '[1,2,3]', type: 'array' },
      { name: 'reCAPTCHA',
        key: 'key',
        value: 'keykeykeykeykeykeykey',
        type: 'text' },
      { name: 'reCAPTCHA',
        key: 'secret',
        value: 'secretsecretsecretsecretsecret',
        type: 'text' },
      { name: 'passport',
        key: 'facebook.name',
        value: 'Facebook',
        type: 'text' },
      { name: 'passport',
        key: 'facebook.protocol',
        value: 'oauth2',
        type: 'text' },
      { name: 'passport',
        key: 'facebook.options.clientID',
        value: 'testtesttesttesttesttest',
        type: 'text' },
      { name: 'passport',
        key: 'facebook.options.clientSecret',
        value: 'testtesttesttesttesttest',
        type: 'text' },
      { name: 'passport',
        key: 'facebook.options.callbackURL',
        value: 'http://localhost:5001/auth/facebook/callback',
        type: 'text' },
      { name: 'passport',
        key: 'facebook.options.scope',
        value: '["email","public_profile"]',
        type: 'array' },
      { name: 'passport',
        key: 'facebook.options.profileFields',
        value: '["id","email","gender","link","locale","name","timezone","updated_time","verified","displayName","photos"]',
        type: 'array' } ]
      const result = ConfigService.pathTOJSON(data);
      console.log(result);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('將 sails.config 同步至 config model', async (done) => {

    try {
      let result = await ConfigService.sync();
      result.should.be.true;
      done();
    } catch (e) {
      done(e);
    }

  });

  it('config model 更新後或是 bootstrap 時，載入 sails.config', async (done) => {

    try {
      let result = await ConfigService.load();
      result.should.be.true;
      done();
    } catch (e) {
      done(e);
    }

  });

  it('相關 service 重新初始，如：email, passport', async (done) => {

    try {
      let result = ConfigService.initService();
      result.should.be.true;
      done();
    } catch (e) {
      done(e);
    }

  });

});
