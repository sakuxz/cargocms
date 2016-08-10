/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = async (cb) => {
  if(!sails.config.urls) sails.config.urls = {afterSignIn: "/"};

  console.log("=== Setup express-helpers ===");
  _.extend(sails.hooks.http.app.locals, sails.config.http.locals);

  let porductionInitDb = async () => {
    let {connection} = sails.config.models;
    let {environment} = sails.config;

    if(connection == 'mysql' && environment == 'production'){

      let {database} = sails.config.connections.mysql;

      let tableList = await sequelize.query(`
        select table_name
        from information_schema.tables
        where table_schema='${database}';
      `);

      if(tableList[0].length == 0){
        sails.log.info("=== porduction init database ===");
        await sequelize.sync({ force: 'drop' });
      }
    }
  }

  try {

    sails.log.info("=== start bootstrap ===");
    sails.services.passport.loadStrategies();
    await porductionInitDb();

    let adminRole = await Role.findOrCreate({
      where: {authority: 'admin'},
      defaults: {authority: 'admin'}
    });
    let userRole = await Role.findOrCreate({
      where: {authority: 'user'},
      defaults: {authority: 'user'}
    });

    let user = await User.create({
      username: 'user',
      email: 'user@gmail.com',
      firstName: '王',
      lastName: '大明'
    });
    let passport = await Passport.create({provider: 'local', password: 'user', UserId: user.id});



    let admin = {
      username: 'admin',
      email: 'admin@gmail.com',
      firstName: '管',
      lastName: '李仁'
    };

    let adminUser = await User.findOrCreate({
      where: {username: 'admin'},
      defaults: admin
    });

    await Passport.findOrCreate({
      where: {provider: 'local', UserId: adminUser[0].id},
      defaults: {provider: 'local', password: 'admin', UserId: adminUser[0].id}
    });

    adminUser[0].addRole(adminRole[0]);

    const {environment} = sails.config;
    if (environment === 'development' && sails.config.models.migrate == 'drop') {
      sails.log.info("init Dev data", environment);

      for (let i = 0; i < 30; i ++) {
        let user = await User.create({
          username: `user${i}`,
          email: `user${i}@gmail.com`,
          firstName: '王',
          lastName: '大明'
        });
        let passport = await Passport.create({provider: 'local', password: 'user', UserId: user.id});
      }

      const image = await Image.create({
        filePath: 'http://www.labfnp.com/modules/core/img/update1.jpg',
        type: 'image/jpeg',
        storage: 'url',
      });
      
      const post = await Post.create({
        title: '香味的一沙一世界5',
        content: '<p>我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材（ex:玫瑰、康乃馨..等)所組成的『這束花的味道』，接著抽出其中的一朵康乃馨，聞到的則是這『一朵康乃馨的味道』，而事實上，若深入去探究此康乃馨的氣味組成，則可小到香味分子的程度：花香由多種香味分子所組成。而這樣的組成就像香水、香料以及香味分子的不同級距來看，香水聞起來是一種味道而細究卻是多種香味分子的組成。</p><p>或許你會以為我們跟台北火車站、天水街的化工行在做一樣的，但實際上，於過去台灣可以找到的香味素材，大多皆已被調好的香精，而這些香精的比例對於供應商來說時常被視為商業機密，所以當你選用了某一供應商所調製的香精時很難了解到其內容組成，而為了調出一樣的味道，你只能持續的跟他買香精、香料。這樣的環境下，對於調香創作的自由度與香味分子本質掌握、認識的程度就會變得非常的低，而LFP秉持著期望每個創作者都可以實際了解香味分子的感受，才能從本質上自主選擇。</p>',
        cover: image.id,
        url: 'http://localhost:5001/blog/flower',
        abstract: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材（ex:玫瑰、康乃馨..等)所組成的『這束花的味道』，接著抽出其中的一朵康乃馨，聞到的則是這『一朵康乃馨的味道』，而事實上，若深入去探究此康乃馨的氣味組成，則可小到香味分子的程度：花香由多種香味分子所組成。而這樣的組成就像香水、香料以及香味分子的不同級距來看，香水聞起來是一種味道而細究卻是多種香味分子的組成',
        UserId: user.id
      })
      const tag = await Tag.create({
        title: '花'
      });
      await post.addTag(tag.id);
      const execSync = require('child_process').execSync;
      execSync(`sqlite3 ${__dirname}/../sqlite.db < ${__dirname}/../import/scentNote.sql`);
      execSync(`sqlite3 ${__dirname}/../sqlite.db < ${__dirname}/../import/scent.sql`);
      execSync(`sqlite3 ${__dirname}/../sqlite.db < ${__dirname}/../import/feeling.sql`);

      // let path = "";
      // await ScentNote.importFeelingFromFile({path});



    }

    cb();
  } catch (e) {
    console.error(e);
    cb(e);
  }
};
