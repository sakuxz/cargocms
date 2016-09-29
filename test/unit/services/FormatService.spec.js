describe('about Format Service operation.', function() {
  it('gen format', async (done) => {
    try {
      const result = FormatService.getQueryObj({ draw: '1',
        columns:[
           { data: 'id', name: '' },
           { data: 'username', name: '' },
           { data: 'displayName', name: '', "searchable": "false"},
           { data: 'email', name: '' },
           { data: 'lastLogin', name: '', "searchable": "false"},
           { data: '5', name: '', "searchable": "false"}
        ],
        order: [ { column: '0', dir: 'asc' } ],
        start: '0',
        length: '10',
        startDate: '2016/08/11',
        endDate: "2016/09/20",
        search: { value: 'userX', regex: 'false' },
        _: '1470989140227'
      });
      sails.log.debug(JSON.stringify(result, null, 2));
      result.where.should.be.Object;
      result.where.$or.should.be.Array;
      result.where.$or[0].id.$like.should.be.String;
      result.where.$or[0].id.$like.should.be.String;
      result.order[0].should.be.Array;
      result.order[0][0].should.be.Array;
      done();
    } catch (e) {
      done(e)
    }
  });
  it('user format query for find',async (done) => {
    try {
      const query = FormatService.getQueryObj({ draw: '1',
        columns:[
           { data: 'id', name: '' },
           { data: 'username', name: '' },
           { data: 'displayName', name: '', "searchable": "false"},
           { data: 'email', name: '' },
           { data: 'lastLogin', name: '', "searchable": "false"},
           { data: '5', name: '', "searchable": "false"}
        ],
        order: [ { column: '0', dir: 'asc' } ],
        start: '0',
        length: '10',
        search: { value: 'user', regex: 'false' },
        _: '1470989140227'
      });

      let users = await User.findAndCountAll(query)
      sails.log.debug(JSON.stringify(users, null, 2));
      done();

    } catch (e) {
      done(e)
    }

  })

  it('gen format', async (done) => {
    try {
      const result = FormatService.getQueryObj({ draw: '1',
        columns:{
          '0': { data: 'id', name: '' },
          '1': { data: 'username', name: '' },
          '2': { data: 'displayName', name: '', "searchable": "false"},
          '3': { data: 'email', name: '' },
          '4': { data: 'lastLogin', name: '', "searchable": "false"},
          '5': { data: '5', name: '', "searchable": "false"}
        },
        order: [ { column: '0', dir: 'asc' } ],
        start: '0',
        length: '10',
        search: { value: 'userX', regex: 'false' },
        _: '1470989140227'
      });
      sails.log.debug(JSON.stringify(result, null, 2));
      result.where.should.be.Object;
      result.where.$or.should.be.Array;
      result.where.$or[0].id.$like.should.be.String;
      result.where.$or[0].id.$like.should.be.String;
      result.order[0].should.be.Array;
      result.order[0][0].should.be.Array;
      done();
    } catch (e) {
      done(e)
    }
  });

  it('get Incude Array Query Obj', async (done) => {
    try {
      const result = FormatService.getIncudeQueryObj({
        include: [{
          model: RecipeOrder,
          include: [User, Recipe]
        }],
        query: { draw: '1',
          columns:{
            '0': { data: 'id', name: '' },
            '1': { data: 'username', name: '' },
            '2': { data: 'displayName', name: '', "searchable": "false"},
            '3': { data: 'email', name: '' },
            '4': { data: 'lastLogin', name: '', "searchable": "false"},
            '5': { data: '5', name: '', "searchable": "false"},
            '6': {
              data: '',
              searchable: true,
              findInclude: true,
              search: {
                model: 'RecipeOrder',
                where: {
                  productionStatus: '123',
                }
              }
            }
          },
          order: [ { column: '0', dir: 'asc' } ],
          start: '0',
          length: '10',
          search: { value: 'userX', regex: 'false' },
          _: '1470989140227'
        }
      });
      sails.log.debug(result);
      done();
    } catch (e) {
      done(e)
    }
  });

  it('get Incude single Query Obj', async (done) => {
    try {
      const result = FormatService.getIncudeQueryObj({
        include: {
          model: RecipeOrder,
          include: [User, Recipe]
        },
        query: { draw: '1',
          columns:{
            '0': { data: 'id', name: '' },
            '1': { data: 'username', name: '' },
            '2': { data: 'displayName', name: '', "searchable": "false"},
            '3': { data: 'email', name: '' },
            '4': { data: 'lastLogin', name: '', "searchable": "false"},
            '5': { data: '5', name: '', "searchable": "false"},
            '6': {
              data: '',
              searchable: true,
              findInclude: true,
              search: {
                model: 'RecipeOrder',
                where: {
                  productionStatus: '123',
                }
              }
            }
          },
          order: [ { column: '0', dir: 'asc' } ],
          start: '0',
          length: '10',
          search: { value: 'userX', regex: 'false' },
          _: '1470989140227'
        }
      });
      sails.log.debug(result);
      done();
    } catch (e) {
      done(e)
    }
  });

});
