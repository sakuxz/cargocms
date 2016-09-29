var sinon = require('sinon');
describe('about export recipe Controller operation.', function() {

  const serialize = (obj, prefix) => {
    let str = [];
    for(let p in obj) {
      if (obj.hasOwnProperty(p)) {
        let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v == "object" ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }

  let recipe;
  before(async (done) => {
    try {
      let user = await User.create({
        username: 'JohnGettingCSV',
        email: 'JohnGettingCSV@gmail.com',
        password: ''
      });
      sinon.stub(AuthService, 'getSessionUser', (req) => {
        return user.toJSON();
      });
      recipe = await Recipe.create({
        formula:[
          {"drops":"1","scent":"BA69","color":"#E87728"},
          {"drops":"2","scent":"BA70","color":"#B35721"}
        ],
        formulaLogs: '',
        authorName: '王大明',
        perfumeName: 'John test perfume',
        message: 'this is love test',
        UserId: user.id,
      });
      console.log('create successful');
      done()
    } catch (e) {
      done(e)
    }
  });

  after((done) => {
    AuthService.getSessionUser.restore();
    done();
  });


  it('Recipe to CSV with Date should be success.', async (done) => {
    try {
      const webForm = { draw: '1',
        type: 'csv',
        startDate: '1900/01/01',
        endDate: '3000/01/01',
        columns:[
           { data: 'id', name: '' },
           { data: 'perfumeName', name: '', "searchable": "true"},
           { data: 'authorName', name: '' , "searchable": "true"},
           { data: 'createdAt', name: '', "searchable": "false"},
           { data: 'updatedAt', name: '', "searchable": "false"},
           { data: 'visibility', name: '', "searchable": "false"},
           { data: 'description', name: '', "searchable": "false"},
           { data: 'message', name: '', "searchable": "false"},
           { data: 'formula', name: '', "searchable": "false"},
        ],
        order: [ { column: '0', dir: 'asc' } ],
        search: { value: 'John', regex: 'false' },
        _: '1470989140227'
      }
      sails.log.error(serialize(webForm));
      const res = await request(sails.hooks.http.app)
      .get(`/api/admin/labfnp/recipe/export`).query(serialize(webForm));
      res.status.should.be.eq(200);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('Recipe to CSV with Date should be success. all date', async (done) => {
    try {
      const webForm = { draw: '1',
        type: 'csv',
        startDate: '',
        endDate: '',
        columns:[
           { data: 'id', name: '' },
           { data: 'perfumeName', name: '', "searchable": "true"},
           { data: 'authorName', name: '' , "searchable": "true"},
           { data: 'createdAt', name: '', "searchable": "false"},
           { data: 'updatedAt', name: '', "searchable": "false"},
           { data: 'visibility', name: '', "searchable": "false"},
           { data: 'description', name: '', "searchable": "false"},
           { data: 'message', name: '', "searchable": "false"},
           { data: 'formula', name: '', "searchable": "false"},
        ],
        order: [ { column: '0', dir: 'asc' } ],
        search: { value: 'John', regex: 'false' },
        _: '1470989140227'
      }
      const res = await request(sails.hooks.http.app)
      .get(`/api/admin/labfnp/recipe/export`).query(serialize(webForm));
      res.status.should.be.eq(200);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('Recipe to CSV with Date should be success. out of date', async (done) => {
    try {
      const webForm = { draw: '1',
        type: 'csv',
        startDate: '1900/1/1',
        endDate: '1901/1/1',
        columns:[
           { data: 'id', name: '' },
           { data: 'perfumeName', name: '', "searchable": "true"},
           { data: 'authorName', name: '' , "searchable": "true"},
           { data: 'createdAt', name: '', "searchable": "false"},
           { data: 'updatedAt', name: '', "searchable": "false"},
           { data: 'visibility', name: '', "searchable": "false"},
           { data: 'description', name: '', "searchable": "false"},
           { data: 'message', name: '', "searchable": "false"},
           { data: 'formula', name: '', "searchable": "false"},
        ],
        order: [ { column: '0', dir: 'asc' } ],
        search: { value: 'John', regex: 'false' },
        _: '1470989140227'
      }
      const res = await request(sails.hooks.http.app)
      .get(`/api/admin/labfnp/recipe/export`).query(serialize(webForm));
      res.status.should.be.eq(200);
      done();
    } catch (e) {
      done(e);
    }
  });

});
