require("../../bootstrap.test.js")
import {login, logout} from "../../util/e2eHelper.js"

describe('test user', () => {
  before((done)=>{
    try {
      console.log("=== admin login ===");
      login("admin");
      done();
    } catch (e) {
      done(e);
    }
  })
  after((done)=>{
    try {
      logout();
      done();
    } catch (e) {
      done(e);
    }
  })

  it('create @watch',async (done) => {
    try {
      const userData = {
        username: 'usertest1',
        email: 'usertest1@gmail.com',
        firstName: '王',
        lastName: '雇員',
        password: '0000'
      };
      // 新增
      browser.url('/admin/#/admin/user');
      browser.waitForExist('#ToolTables_main-table_1')
      browser.click('#ToolTables_main-table_1');

      //填入資料
      browser.pause(1000);
      browser.waitForExist('[class="btn btn-primary"]');
      browser.setValue('[name="username"]', userData.username)
      .setValue('[name="email"]', userData.email)
      .setValue('[name="firstName"]', userData.firstName)
      .setValue('[name="lastName"]', userData.lastName)
      .setValue('[name="password"]', userData.password)
      .setValue('[name="passwordConfirm"]', userData.password);
      //送出
      browser.click('[class="btn btn-primary"]')
      .waitForExist('[class="btn btn-primary"]', null, true);
      //檢查
      browser.pause(1000);
      const res = await User.find({where: {username: userData.username}});
      console.log("res.toJSON()", res.toJSON());
      res.username.should.be.eq(userData.username);
      res.email.should.be.eq(userData.email);

      // expect(browser.elements('#ToolTables_main-table_1')!=null).to.equal(true);
      done();
    } catch (e) {
      console.error(e.stack);
      done(e);
    }
  });

  it('Update user infomation', async(done) => {
    try{
      const updateTargetUser = 'usertest1';

      const userInfo = {
        username: 'BrooklynBackham',
        email: 'brooklynBay@email.com',
        firstName: 'Brooklyn',
        lastName: 'Backham',
        password: 'chloe'
      }

      //search user item
      browser.url('/admin/#/admin/user');
      browser.waitForExist('#main-table_filter input[type="search"]')
      browser.setValue('#main-table_filter input[type="search"]', updateTargetUser);

      browser.pause(1000);
      browser.waitForExist('#ToolTables_main-table_2')
      browser
        .click('#main-table tbody')
        .click('#ToolTables_main-table_2');

      browser.pause(1000);
      browser.waitForExist('[name="username"]');
      browser
        .setValue('[name="username"]', userInfo.username)
        .setValue('[name="email"]', userInfo.email)
        .setValue('[name="firstName"]', userInfo.firstName)
        .setValue('[name="lastName"]', userInfo.lastName);

      //save
      browser
        .click('[class="btn btn-primary"]')
        .waitForExist('[class="btn btn-primary"]', null, true);

      browser.pause(1000);
      //降冪排序
      browser.waitForExist('#main-table-widget tr th:nth-child(1)');
      browser.click('#main-table-widget tr th:nth-child(1)');

      //check
      const userUpdateField = browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)').getText();
      const res = await User.find({where: {email: userInfo.email}});

      //檢查更新後資料庫data是否與前端呈現相符
      expect(res.email).to.be.equal(userUpdateField);

      done();
    }catch(e){
      done(e);
    }
  });

  describe('User List Test', () =>{
    //double click 進入檢視畫面
    it('Double Click into info page.', async(done) => {
      try{
        browser.url('/admin/#/admin/user');
        browser.waitForExist('#main-table_filter input[type="search"]');
        browser.setValue('#main-table_filter input[type="search"]', 'brooklynBay@email.com');
        browser.pause(1000);

        const userEmail = browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)')
                          .getText();
        browser.doubleClick('#main-table-widget tbody tr:nth-child(1)');
        //進入檢視頁面，比對email是否相同
        browser.waitForExist('#main-show');
        browser.getText('ul.list-unstyled > li:nth-child(1) > p > a')
        .should.be.equal(userEmail);
        done();
      }
      catch(e){
        done(e);
      }
    });

    //click 點擊一筆資料，並點選表格上方檢視按鈕，進入檢視畫面
    it('select one record, click view button ', async (done) =>{
      try{
        browser.url('/admin/#/admin/user');
        browser.waitForExist('#main-table_filter input[type="search"]');

        const userEmail = browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)')
                          .getText();
        browser.click('#main-table-widget tbody tr:nth-child(1)');
        browser.click('#ToolTables_main-table_0');
        //進入檢視頁面，比對email是否相同
        browser.waitForExist('#main-show');
        browser.getText('ul.list-unstyled > li:nth-child(1) > p > a')
        .should.be.equal(userEmail);
        done();
      }
      catch(e){
        done(e);
      }
    });
    //click 點擊一筆資料的右方「檢視」按鈕進入檢視畫面
    it('click view button on the right', async (done) =>{
      try{
        browser.url('/admin/#/admin/user');
        browser.waitForExist('#main-table_filter input[type="search"]');

        const userEmail = browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)')
                          .getText();

        browser.click('#main-table > tbody > tr:nth-child(1) > td:nth-child(6) > div > a:nth-child(1)');
        //進入檢視頁面，比對email是否相同
        browser.waitForExist('#main-show');
        browser.getText('ul.list-unstyled > li:nth-child(1) > p > a')
        .should.be.equal(userEmail);
        done();
      }
      catch(e){
        done(e);
      }
    });
    //click 點擊一筆資料的右方「編輯」按鈕進入編輯畫面
    it('click edit button on the right', async (done) =>{
      try{
        browser.url('/admin/#/admin/user');
        browser.waitForExist('#main-table_filter input[type="search"]');

        const userEmail = browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)')
                          .getText();
        browser.click('#main-table > tbody > tr:nth-child(1) > td:nth-child(6) > div > a:nth-child(2)');
        //進入編輯頁面，比對email是否相同
        browser.waitForExist('#main-edit');

        browser.getValue('[type=email]').should.be.equal(userEmail);
        done();
      }
      catch(e){
        done(e);
      }
    });
  });

  describe('delete user', () => {
    let deleteThisUser;
    before(async (done) => {
      try {
        deleteThisUser = await User.create({
          username: `testDeleteWatch`,
          email: `testDeleteWatch@gmail.com`,
          firstName: 'test',
          lastName: 'DeleteWatch'
        });
        let passport = await Passport.create({provider: 'local', password: 'user', UserId: deleteThisUser.id});
        sails.log.info('deleteThisUser.id=>', deleteThisUser.id);
        done();
      } catch (e) {
        done(e)
      }
    });

    it('delete @watch', async (done) => {

      try {
        //search user item
        browser.url('/admin/#/admin/user');
        //搜尋該user 進入編輯user頁面
        browser.waitForExist('#main-table_filter input[type="search"]');
        browser.setValue('#main-table_filter input[type="search"]', deleteThisUser.username);

        browser.pause(2000);
        browser.waitForExist('#ToolTables_main-table_2');
        browser
        .click('#main-table tbody')
        .click('#ToolTables_main-table_2');

        browser.waitForExist('[name="username"]');
        //點擊刪除user
        browser.click('.btn.btn-danger');
        //確定刪除
        browser.waitForExist('#bot1-Msg1');
        browser.click('#bot1-Msg1');
        //等待後端完成刪除 跳轉回user列表
        browser.waitForExist('#main-table_filter input[type="search"]');

        let res = await User.find({
          where: {
            username: deleteThisUser.username
          }
        });
        (res === null).should.be.true;
        done();
      } catch (e) {
        done(e);
      }

    })
  });

});
