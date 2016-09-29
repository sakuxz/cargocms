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

import fs from 'fs';
import shortid from 'shortid';
import MailerService from 'sails-service-mailer';
module.exports.bootstrap = async (cb) => {
  if(!sails.config.shareUrl) sails.config.shareUrl = "localhost:"+ sails.config.port
  // 這個已經用 config/urls.js 定義預設值
  //if(!sails.config.urls) sails.config.urls = {afterSignIn: "/"};
  _.extend(sails.hooks.http.app.locals, sails.config.http.locals);

  const {environment} = sails.config;


  try {

    sails.log.info("=== start bootstrap ===");
    sails.services.passport.loadStrategies();

    let allpayConfig = sails.config.allpay;
    if (!allpayConfig) {
      allpayConfig = {
        merchantID: '2000132',
        hashKey: '5294y06JbISpM5x9',
        hashIV: 'v77hoKGq4kWxNNIS',
        debug: true,
        ReturnURL:'/api/allpay/paid',
        ClientBackURL:'/shop/done',
        PaymentInfoURL:'/api/allpay/paymentinfo',
        paymentMethod:[
          {
            code: 'ATM',
            name: 'ATM'
          },{
            code: 'Credit',
            name: '信用卡'
          }
        ]
      }
    }
    let AllpayClass = require('../api/services/libraries/Allpay');
    global.AllpayService = new AllpayClass.default({
      domain: allpayConfig.domain,
      merchantID: allpayConfig.merchantID,
      hashKey: allpayConfig.hashKey,
      hashIV: allpayConfig.hashIV,
      debug: allpayConfig.debug,
      prod: environment === 'production',
      ReturnURL: allpayConfig.ReturnURL,
      ClientBackURL: allpayConfig.ClientBackURL,
      PaymentInfoURL: allpayConfig.PaymentInfoURL,
      allpayModel: Allpay,
    });

    let {environment} = sails.config;
    let {connection} = sails.config.models;

    if (!sails.config.hasOwnProperty('offAuth'))
      sails.config.offAuth = false;

    if(environment == 'production'){
      sails.config.offAuth = false;
      let recipes = await Recipe.findAll({where: {hashId:{$eq: null}}})
      let updateRecipes = recipes.map((recipe) => {
        recipe.hashId = shortid.generate();
        return recipe.save();
      })

      await Promise.all(updateRecipes);

    }

    let adminRole = await Role.findOrCreate({
      where: {authority: 'admin'},
      defaults: {authority: 'admin'}
    });

    let userRole = await Role.findOrCreate({
      where: {authority: 'user'},
      defaults: {authority: 'user'}
    });

    User.findOrCreate({
      where: {
        username: 'admin'
      },
      defaults: {
        username: 'admin',
        email: 'admin@example.com',
        firstName: '李仁',
        lastName: '管'
      }
    }).then(function(adminUsers) {
      Passport.findOrCreate({
        where: {
          provider: 'local',
          UserId: adminUsers[0].id
        },
        defaults: {
          provider: 'local',
          password: 'admin',
          UserId: adminUsers[0].id
        }
      });
      adminUsers[0].addRole(adminRole[0]);
    });


    /*
     * 是否要匯入的判斷必須交給 init 定義的程式負責
     */

    if (environment !== 'test') {
      // 自動掃描 init 底下的 module 資料夾後執行資料初始化
      fs.readdir('./config/init/', function(err, files) {
        for (var i in files) {
          let dirName = files[i];
          let isDir = fs.statSync('./config/init/' + dirName).isDirectory();
          if (isDir) {
            let hasIndexFile = fs.statSync('./config/init/' + dirName + '/index.js').isFile();
            require('./init/' + dirName).init();
          }
        }
      });
    }

    if (environment === 'development' && sails.config.models.migrate == 'drop') {
      sails.log.info("init Dev data", environment);

      User.create({
        username: 'user',
        email: 'user@example.com',
        firstName: '大明',
        lastName: '王'
      }).then(function(user) {
        Passport.create({
          provider: 'local',
          password: 'user',
          UserId: user.id
        });
      });

      await Post.create({
        title: '自造者世代（MAKERS）與第三次工業革命',
        content: '<p class="lead">自造者世代的興起源自於網路、科技的進步與每個人渴望參與創造的特質，人們開始了解到知識的傳遞與以開放的內心學習不同知識、跨領域的結合之重要性。</p><p>因此近年開展出了，被稱為『第三次工業革命的機會』，則是一個新的工業化思維，並闡述人們開始從原來產品的使用者轉為產品的設計者，且發現到實際上自己參與實作並沒那麼難。讓過去被認為是所謂的休閒嗜好之活動，反而創造出原本不被想像的價值，以打破過去工業化時代大量化製造的障礙，以群募得方式找到某一特定群體所關注的議題，並實現此群體共同的想像。</p><blockquote>『第三次工業革命的機會』，這會是我們大家的機會，一個群體共創價值的時代，不僅只是透過3D printer此類型工具做表象上的改變，同時更是在每個人的思維上都增添了不同創作力的想像！</blockquote>',
        coverType: 'video',
        coverUrl: 'https://www.youtube.com/embed/VREirE8afgg',
        url: 'http://localhost:5001/blog/flower',
        abstract: '自造者世代的興起源自於網路、科技的進步與每個人渴望參與創造的特質，人們開始了解到知識的傳遞與以開放的內心學習不同知識、跨領域的結合之重要性。',
        UserId: 1,
      });

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
        UserId: 1,
      });

      const tag = await Tag.create({
        title: '花'
      });

      await post.addTag(tag.id);

      const recipeLove = {
        formula:[
          {"drops":"1","scent":"T12","color":"#E87728"},
          {"drops":"2","scent":"BA70","color":"#B35721"},
          {"drops":"3","scent":"T25","color":"#B35721"},
          {"drops":"4","scent":"BU2","color":"#B35721"},
          {"drops":"5","scent":"T4","color":"#B35721"},
          {"drops":"6","scent":"B13","color":"#B35721"}
        ],
        formulaLogs: '',
        authorName: '王大明',
        perfumeName: 'love',
        description: 'this is love',
        message: '備註',
        UserId: 1,
      }
      Recipe.create(recipeLove);

      const recipeLoveAgain = {
        formula:[
          {"drops":"1","scent":"BA69","color":"#E87728"},
          {"drops":"2","scent":"BA70","color":"#B35721"}
        ],
        visibility: "PUBLIC" ,
        formulaLogs: '',
        authorName: '王大明',
        perfumeName: 'love again',
        description: 'this is love again',
        message: '備註',
        UserId: 1,
      };

      let testRecipe = await Recipe.create(recipeLoveAgain);

      //建立一筆 Allpay 資料，使用上方 testRecipe資料
      let recipeOrder = await RecipeOrder.create({
        remark: '123',
        UserId: 1,
        RecipeId: testRecipe.id,
      });
      let data = {
        relatedKeyValue: {
          //RecipeId: recipe.id,
          RecipeOrderId: recipeOrder.id,
        },
        "TradeNo": "1608301610017019",
        "MerchantTradeNo": "57feb73f",
        "RtnCode": 1,
        "RtnMsg": "付款成功",
        "PaymentDate": "2016-08-30 16:11:59",
        "TradeDate": "2016-08-30 16:10:21",
        "PaymentType": "ATM_TAISHIN",
        "ShouldTradeAmt": 999,
        "TradeAmt": 999,
        "BankCode": "812",
        "vAccount": "9966627013152469",
        "ExpireDate": "2016/09/02",
        "PaymentNo": null,
        "Barcode1": null,
        "Barcode2": null,
        "Barcode3": null,
        "CheckMacValue": null,
        "MerchantTradeDate": null,
        "RecipeOrderId": recipeOrder.id,
      }
      await Allpay.create(data);

      recipeOrder = await RecipeOrder.create({
        remark: '456',
        UserId: 1,
        RecipeId: testRecipe.id,
      });

      data = {
        relatedKeyValue: {
          //RecipeId: recipe.id,
          RecipeOrderId: recipeOrder.id,
        },
        "TradeNo": "1608301605202918",
        "MerchantTradeNo": "301ea83b",
        "RtnCode": 1,
        "RtnMsg": "交易成功",
        "PaymentDate": "2016-08-30 16:07:23",
        "TradeDate": null,
        "PaymentType": "Credit_CreditCard",
        "ShouldTradeAmt": null,
        "TradeAmt": 999,
        "BankCode": null,
        "vAccount": null,
        "ExpireDate": null,
        "PaymentNo": null,
        "Barcode1": null,
        "Barcode2": null,
        "Barcode3": null,
        "CheckMacValue": null,
        "MerchantTradeDate": null,
        "RecipeOrderId": recipeOrder.id,
      }
      await Allpay.create(data);

      // == Message ==
      let order = {
        serialNumber: 'test',
        User: {
          username: 'testUser',
          email: 'smlsun@gmail.com'
        }
      }
      let messageConfig = await MessageService.paymentConfirm(order);
      let message = await Message.create(messageConfig);
      await MessageService.sendMail(message);
      // == Message done. ==
    }

    cb();
  } catch (e) {
    console.error(e.stack);
    cb(e);
  }
};
