
var MongoClient = require('mongodb').MongoClient;
describe.skip('legacy data', function() {

  it('user import should be success.', async (done) => {
    // {
    //   "_id": "57d1887397e6d2cc058fe419",
    //   "username": "antidelight",
    //   "displayName": "Ann Hou",
    //   "provider": "facebook",
    //   "providerData": {
    //     "accessToken": "",
    //     "picture": {
    //       "data": {
    //         "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/14040193_10153217781332706_1948821972235146116_n.jpg?oh=b6a95deb5387204c57b9152b8eb1d403&oe=5879A730",
    //         "is_silhouette": false
    //       }
    //     },
    //     "email": "antidelight@hotmail.com",
    //     "name": "Ann Hou",
    //     "first_name": "Ann",
    //     "last_name": "Hou",
    //     "id": "10153260869832706"
    //   },
    //   "created": "2016-09-08T15:49:07.342Z",
    //   "roles": [
    //     "user"
    //   ],
    //   "profileImageURL": "//graph.facebook.com/10153260869832706/picture?type=large",
    //   "password": "",
    //   "email": "antidelight@hotmail.com",
    //   "lastName": "Hou",
    //   "firstName": "Ann",
    //   "__v": 0
    // }

    MongoClient.connect("mongodb://user:password@localhost:42128/db", function(err, db) {
      if(err) return done(err);

      console.log("We are connected test");
      var collection = db.collection('users');
      collection.find().toArray(function(err, users) {
        console.log(JSON.stringify(users[users.length-1], null, 2));



        var newUsers = users.map((user) => {
          var newUser = User.build();
          newUser.username = user.username
          newUser.lastName = user.lastName
          newUser.firstName = user.firstName
          newUser.email = user.email
          newUser.avatar = user.profileImageURL
          newUser.username = user.username
          console.log("== user._id ==", user._id);
          newUser.legacyId = user._id.toString()

          if(user.provider == 'facebook'){
            newUser.facebookId = user.providerData.id;
          }
          newUser.rowdata = user;
          return newUser.save();
        });



        Promise.all(newUsers).then((createdUsers) => {
          var newPassports = createdUsers.map((user) => {
            var newPassport = Passport.build();
            newPassport.username = user.username
            newPassport.provider = user.rowdata.provider

            newPassport.password = user.rowdata.password
            newPassport.salt = user.rowdata.salt

            if(user.rowdata.provider == 'facebook'){
              newPassport.protocol = "oauth2"
              newPassport.identifier = user.facebookId
              var accessToken = user.rowdata.providerData.accessToken
              newPassport.tokens = {accessToken}

            }else {
              newPassport.protocol = "local"
            }

            newPassport.UserId = user.id
            return newPassport.save();
          });

          Promise.all(newPassports).then((createdPassports)=>{
            done();
          }).catch(function(reason) {
            console.log(reason.stack);
            done();
          });

        }).catch(function(reason) {
          console.log(reason.stack);
          done(reason);
        });
      });
    });
  });
  it('articles import should be success.', async (done) => {
    // {
    //   "_id": "57d2169d97e6d2cc058fe41c",
    //   "user": "57bd2f2e97e6d2cc058fe21a",
    //   "fmSum": 16,
    //   "formula": [],
    //   "fmRatio": [
    //     0.1875,
    //     0.3125,
    //     0.0625,
    //     0.1875,
    //     0.1875,
    //     0.0625
    //   ],
    //   "fmName": [
    //     "TA62",
    //     "T14",
    //     "M6",
    //     "M23",
    //     "BA71",
    //     "B7"
    //   ],
    //   "fmDrop": [
    //     3,
    //     5,
    //     1,
    //     3,
    //     3,
    //     1
    //   ],
    //   "f_author": "陳淑華",
    //   "perfumeName": "鬆甜",
    //   "invoicenum": "72252",
    //   "message": "我之前已調過一樣的。希望這次味道能盡量保持一樣",
    //   "address": "新北市汐止區福德一路213巷5號3樓",
    //   "phonenum": "0926319027",
    //   "created": "2016-09-09T01:55:41.028Z",
    //   "__v": 0
    // }
    MongoClient.connect("mongodb://willylfp:lfpwilliam0711@ds042128.mongolab.com:42128/MongoLab-5", function(err, db) {
      if(err) return done(err);
      console.log("We are connected test");

      var collection = db.collection('articles');

      collection.find().toArray(function(err, articles) {
        var newRecipes = articles.map((article) => {
          var newRecipe = Recipe.build();
          newRecipe.authorName = article.f_author
          newRecipe.perfumeName = article.perfumeName
          newRecipe.message = article.message

          // [
          // {"scent":"M6","drops":"1","color":"#F7D440"},
          // {"scent":"B17","drops":"2","color":"#971E32"}
          // ]

          let formula = article.fmName.map((fmName, index) => {
            let scent = fmName
            let drops = article.fmDrop[index]
            let oneFormula = {scent, drops}

            return oneFormula
          })

          newRecipe.formula = formula;


          newRecipe.legacyUserId = article.user.toString();
          return newRecipe.save();
        });

        Promise.all(newRecipes).then((createdRecipes)=>{
          done();
        }).catch(function(reason) {
          done(reason);
        });
        // user sql update userId

        // update Recipes
        // inner join Users
        // on Recipes.legacyUserId = Users.legacyId
        // set Recipes.UserId = Users.id;
      });

    });

  });
});
