require("../../bootstrap.test.js")
import {login, logout} from "../../util/e2eHelper.js"

describe('test user', () => {
  before(async (done)=>{
    try {
      console.log("=== admin login ===");
      await login("admin");
      done();
    } catch (e) {
      done(e);
    }
  })
  after(async (done)=>{
    try {
      await logout();
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
      await browser.url('/admin/#/admin/user');
      await browser.waitForExist('#ToolTables_main-table_2')
      await browser.click('#ToolTables_main-table_2');

      //填入資料
      await browser.pause(1000);
      await browser.waitForExist('[class="btn btn-primary"]');
      await browser.setValue('[name="username"]', userData.username)
      .setValue('[name="email"]', userData.email)
      .setValue('[name="firstName"]', userData.firstName)
      .setValue('[name="lastName"]', userData.lastName)
      .setValue('[name="password"]', userData.password)
      .setValue('[name="passwordConfirm"]', userData.password);
      //送出
      await browser.click('[class="btn btn-primary"]')
      .waitForExist('[class="btn btn-primary"]', null, true);
      //檢查
      await browser.pause(1000);
      const res = await User.find({where: {username: userData.username}});
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
    console.log("Update user infomation");
    try{
      let updateTargetUser = 'admin';

      let userInfo = {
        username: 'admin',
        email: 'brooklynBay@email.com',
        firstName: 'Brooklyn',
        lastName: 'Backham',
        password: 'chloe'
      }

      //search user item
      console.log("Update user infomation 1");
      browser.url('/admin/#/admin/user');
      console.log("Update user infomation 11");
      await browser.pause(1000);

      await browser.waitForExist('#main-table_filter input[type="search"]')
      await browser.setValue('#main-table_filter input[type="search"]', updateTargetUser);
      console.log("Update user infomation 2");
      await browser.pause(1000);
      await browser.waitForExist('#ToolTables_main-table_3')
      await browser
        .click('#main-table tbody')
        .click('#ToolTables_main-table_3');
      console.log("Update user infomation 3");
      await browser.pause(1000);
      await browser.waitForExist('[name="username"]');
      await browser
        .setValue('[name="username"]', userInfo.username)
        .setValue('[name="email"]', userInfo.email)
        .setValue('[name="firstName"]', userInfo.firstName)
        .setValue('[name="lastName"]', userInfo.lastName);

      //save
      await browser
        .click('[class="btn btn-primary"]')
        .waitForExist('[class="btn btn-primary"]', null, true);

      //check
      const userUpdateField = await browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)').getText();
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
        await browser.url('/admin/#/admin/user');
        await browser.waitForExist('#main-table_filter input[type="search"]');
        await browser.setValue('#main-table_filter input[type="search"]', 'admin');
        await browser.pause(1000);

        const userEmail = await browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)')
                          .getText();
        await browser.doubleClick('#main-table-widget tbody tr:nth-child(1)');
        await browser.pause(1000);
        //進入檢視頁面，比對email是否相同
        await browser.waitForExist('#main-show');
        const uiEmail = await browser.getText('ul.list-unstyled > li:nth-child(1) > p > a')

        uiEmail.should.be.equal(userEmail);
        done();
      }
      catch(e){
        done(e);
      }
    });

    //click 點擊一筆資料，並點選表格上方檢視按鈕，進入檢視畫面
    it('select one record, click view button ', async (done) =>{
      try{
        await browser.url('/admin/#/admin/user');
        await browser.waitForExist('#main-table_filter input[type="search"]');
        await browser.setValue('#main-table_filter input[type="search"]', 'admin');
        await browser.pause(1000);

        const userEmail = await browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)')
                          .getText();
        await browser.click('#main-table-widget tbody tr:nth-child(1)');
        await browser.click('#ToolTables_main-table_1');
        await browser.pause(1000);
        //進入檢視頁面，比對email是否相同
        await browser.waitForExist('#main-show');
        const uiEmail = await browser.getText('ul.list-unstyled > li:nth-child(1) > p > a')
        uiEmail.should.be.equal(userEmail);
        done();
      }
      catch(e){
        done(e);
      }
    });
    //click 點擊一筆資料的右方「檢視」按鈕進入檢視畫面
    it('click view button on the right', async (done) =>{
      try{
        await browser.url('/admin/#/admin/user');
        await browser.waitForExist('#main-table_filter input[type="search"]');
        await browser.setValue('#main-table_filter input[type="search"]', 'admin');
        await browser.pause(1000);

        const userEmail = await browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)')
                          .getText();

        await browser.click('a[name="showDataButton"]');
        await browser.pause(1000);
        //進入檢視頁面，比對email是否相同


        await browser.waitForExist('#main-show');

        const uiEmail = await browser.getText('ul.list-unstyled > li:nth-child(1) > p > a')
        uiEmail.should.be.equal(userEmail);
        done();
      }
      catch(e){
        done(e);
      }
    });
    //click 點擊一筆資料的右方「編輯」按鈕進入編輯畫面
    it('click edit button on the right', async (done) =>{
      try{
        await browser.url('/admin/#/admin/user');
        await browser.waitForExist('#main-table_filter input[type="search"]');
        await browser.setValue('#main-table_filter input[type="search"]', 'admin');
        await browser.pause(1000);

        const userEmail = await browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)')
                          .getText();

        console.log("=== userEmail ===", userEmail);
        await browser.click('a[name="editDataButton"]');
        await browser.pause(1000);
        //進入編輯頁面，比對email是否相同
        await browser.waitForExist('#main-edit');

        const uiEmail = await browser.getValue('input[name="email"]')
        console.log("=== uiEmail ===", uiEmail);
        uiEmail.should.be.equal(userEmail);
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
        done();
      } catch (e) {
        done(e)
      }
    });

    it('delete @watch', async (done) => {

      try {
        //search user item
        await browser.url('/admin/#/admin/user');
        //搜尋該user 進入編輯user頁面
        await browser.waitForExist('#main-table_filter input[type="search"]');
        await browser.setValue('#main-table_filter input[type="search"]', deleteThisUser.id);

        await browser.pause(1000);
        await browser.waitForExist('#ToolTables_main-table_3')
        await browser
          .click('#main-table tbody')
          .click('#ToolTables_main-table_3');

        await browser.pause(1000);

        await browser.waitForExist('[name="username"]');
        //點擊刪除user
        await browser.click('.btn.btn-danger');
        await browser.pause(1000);
        //確定刪除
        await browser.waitForExist('#bot1-Msg1');
        await browser.click('#bot1-Msg1');
        await browser.pause(1000);
        //等待後端完成刪除 跳轉回user列表


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
