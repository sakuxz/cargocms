import moment from 'moment';
import shortid from 'shortid';

module.exports = {
  attributes: {
    hashId: {
      type: Sequelize.STRING(32),
      unique: true,
    },
    // TODO authorAvatar
    formula: {
      // from `full_picture`
      type: Sequelize.TEXT,
      set (val) {
        if (val) {
          this.setDataValue('formula', JSON.stringify(val));
        } else {
          this.setDataValue('formula', "[]");
        }
      },
      get () {
        try {
          var formula = this.getDataValue('formula');
          if (formula) {
            return JSON.parse(formula);
          } else {
            return [];
          }
        }
        catch (e) {
          sails.log.error(e);
          return [];
        }
      },
    },

    formulaTotalDrops: {
      type: Sequelize.VIRTUAL,
      get () {
        try {
          var formula = this.getDataValue('formula');
          let formulaTotalDrops = 0;
          if (formula) {
            JSON.parse(formula).forEach((element, index, array) => {
              formulaTotalDrops += Number(element.drops);
            })
          }
          return formulaTotalDrops;
        }
        catch (e) {
          sails.log.error(e);
          return 0;
        }
      },
    },

    formulaLogs: {
      type: Sequelize.TEXT,
    },

    authorName: {
      type: Sequelize.STRING,
      defaultValue: '',
    },

    authorFbPage: {
      type: Sequelize.VIRTUAL,
      get() {
        try {
          const thisUser = this.getDataValue('User');
          let fbId = 'https://www.facebook.com/LabFnP';
          if (thisUser) {
            if (thisUser.Passports) {
              thisUser.Passports.forEach((passport) => {
                const existProvider = typeof passport.dataValues.provider === 'string';
                const checkProviderType = passport.dataValues.provider === 'facebook';
                if (existProvider && checkProviderType) {
                  fbId = passport.dataValues.identifier;
                }
              });
            }
          }
          return fbId;
        } catch (e) {
          sails.log.error(e);
        }
      },
    },

    perfumeName: {
      type: Sequelize.STRING,
      defaultValue: '',
    },

    message: {
      type: Sequelize.STRING,
      get() {
        const val = this.getDataValue('message');
        if (typeof val !== 'string' || val === null) return '';
        return val;
      },
    },

    description: {
      type: Sequelize.STRING,
      get() {
        const val = this.getDataValue('description');
        if (typeof val !== 'string' || val === null) return '';
        return val;
      },
    },

    createdBy: {
      type: Sequelize.ENUM('scent', 'feeling'),
      defaultValue: 'scent',
    },

    coverPhoto: {
      type: Sequelize.STRING,
      defaultValue: '',
      get() {
        try {
          const thisImage = this.getDataValue('Image');
          const thisId = this.getDataValue('id');
          const value = thisImage ?
            thisImage.url : `assets/labfnp/img/recipe-default-cover.${thisId % 7}.jpg`;
          return UtilsService.getUrl(value);
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },

    visibility: {
      type: Sequelize.ENUM('PUBLIC', 'PRIVATE', 'PROTECTED'),
      defaultValue: 'PRIVATE',
    },

    visibilityDesc: {
      type: Sequelize.VIRTUAL,
      get() {
        let desc = '';
        switch (this.visibility) {
          case 'PUBLIC':
            desc = '公開';
            break;
          case 'PRIVATE':
            desc = '非公開';
            break;
          case 'PROTECTED':
            desc = '半公開';
            break;
          default:
            desc = '公開';
        }
        return desc;
      },
    },
    createdDateTime: {
      type: Sequelize.VIRTUAL,
      get(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('createdAt'));
        } catch(e){
          sails.log.error(e);
        }
      },
    },

    updatedDateTime: {
      type: Sequelize.VIRTUAL,
      get(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('updatedAt'));
        } catch(e){
          sails.log.error(e);
        }
      },
    },

    createdAtIso: {
      type: Sequelize.VIRTUAL,
      get() {
        try {
          return moment(new Date(this.getDataValue('createdAt')), moment.ISO_8601);
        } catch (e) {
          sails.log.error(e);
        }
      },
    },

    updatedAtIso: {
      type: Sequelize.VIRTUAL,
      get() {
        try {
          return moment(new Date(this.getDataValue('updatedAt')), moment.ISO_8601);
        } catch (e) {
          sails.log.error(e);
        }
      },
    },

    displayFormula: {
      type: Sequelize.VIRTUAL,
      get() {
        try {
          let dpFormulaArray = [];

          if (typeof this.getDataValue('formula') !== 'undefined') {
            const formulaTotalDrops = this.get('formulaTotalDrops');
            const formulaJson = JSON.parse(this.getDataValue('formula'));
            let index = 0;

            for (const formula of formulaJson) {
              const value = Math.round(( formula.drops / formulaTotalDrops * 100 ) * 10000) / 10000;
              dpFormulaArray.push({
                index: index,
                value: `${formula.scent} - ${formula.drops}滴(${value}%)`
              });
              index += 1;
            }
          }

          return dpFormulaArray;
        } catch (e) {
          sails.log.error(e);
        }
      },
    },
    invoicenum: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    phonenum: {
      type: Sequelize.STRING,
    },
    created: {
      type: Sequelize.STRING,
    },
    sourceId: {
      type: Sequelize.STRING,
    },

  },
  associations() {
    Recipe.hasMany(UserLikeRecipe);
    Recipe.belongsTo(User);
    Recipe.belongsTo(Image, {
      foreignKey: {
        name: 'coverPhotoId'
      }
    });
    User.hasMany(Recipe);
  },
  options: {
    classMethods: {
      async findOneWithScent({id}) {
        sails.log.info("findOneWithUser id=>", id);
        let recipeWithScent = '';
        const recipes = await Recipe.findOne({
          where: { $or: [{ id }, {hashId: id}] },
          include: [User, Image],
        });
        return recipes;
      },

      deleteById: async (id) => {
        try {
          return await Recipe.destroy({ where: { id } });
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
      getFindAndIncludeUserLikeParam: ({ findByRecipeId, findByUserId, currentUser, start, length, likeUser }) => {
        try {
          const whereParam = { where: {} };
          if (findByUserId) {
            whereParam.where.UserId = findByUserId;
          } else if (findByRecipeId) {
            whereParam.where.id = findByRecipeId;
            // whereParam.where.$or = [
            //   { id: parseInt(findByRecipeId, 10) },
            //   { hashId: findByRecipeId },
            // ]
          }
          let notAdmin = true;
          const ownUserId = {};
          if (currentUser) {
            notAdmin = currentUser.rolesArray.indexOf('admin') === -1;
            ownUserId.UserId = currentUser.id;
          }
          if (notAdmin && !likeUser) {
            whereParam.where.$or = [
              { visibility: { $not: 'PRIVATE' } },
              ownUserId,
            ];
          }
          let paging = {};
          if (start != null && length != null) {
            paging = {
              offset: start,
              limit: length,
            };
          }
          const currentUserId = currentUser ? currentUser.id : -1;
          const likeWhere = likeUser ? {
            UserId: likeUser.id,
          } : {};
          const likeRequired = !!likeUser;
          return {
            ...whereParam,
            ...paging,
            order: [['createdAt', 'DESC']],
            include: [{
              model: UserLikeRecipe,
              where: likeWhere,
              required: likeRequired,
            }, {
              model: Image,
            }, {
              model: User,
              include: {
                model: Passport,
                attributes: ['provider', 'identifier'],
              },
            }],
          };
        } catch (e) {
          throw e;
        }
      },
      async findAndIncludeUserLike({findByRecipeId, findByUserId, currentUser, start, length, likeUser }){
        try {
          const findParam = this.getFindAndIncludeUserLikeParam({
            findByRecipeId,
            findByUserId,
            currentUser,
            start,
            length,
            likeUser
          });
          let recipes = await Recipe.findAll(findParam);
          recipes.map((recipe) => recipe.checkCurrentUserLike({currentUser}));
          return recipes;
        } catch (e) {
          throw e;
        }
      },
      async findOneAndIncludeUserLike({findByRecipeId, findByUserId, currentUser }){
        try {
          const findParam = this.getFindAndIncludeUserLikeParam({findByRecipeId, findByUserId, currentUser });
          const recipe = await Recipe.findOne(findParam);

          if(!recipe)return recipe;

          await recipe.checkCurrentUserLike({currentUser})
          return recipe;
        } catch (e) {
          throw e;
        }
      },
      async getFeelings({id}){
        try {
          const recipe = await Recipe.findOne({
            where: { $or: [{ id }, {hashId: id}] }
          });
          const {formula} = recipe;

          const secntNames = formula.map(oneFormula => oneFormula.scent)
          const where = {name: secntNames}

          // lookup data
          const scents = await Scent.findAll({where});

          // get data like
          // [ {key: f1, scent:s1, value:10},{key: f1, scent:s2, value:3} ]
          let ungroupfeelings = []
          scents.forEach(function(scent) {
            let currentScent = scent.name;
            scent.feelings.forEach((feel) => {
              ungroupfeelings.push({
                key: feel.key,
                value: feel.value,
                scent: currentScent
              })
            });
          });

          // grouping data like
          // [ {key: f1, value:13, scent: [{name: s1, value: 10},{name: s2, value: 3}] } ]
          let feelings = [];
          ungroupfeelings.forEach((item) => {
            // check this feel already in feelings or not
            let findIDX = undefined;
            feelings.forEach((inListFeel,inListFeelIndex) => {
              if (item.key === inListFeel.key) {
                findIDX = inListFeelIndex;
              }
            })
            let strength = parseInt(item.value)

            if (findIDX === undefined) {
              feelings.push({
                key: item.key,
                value: strength,
                scent: [{name: item.scent, value: item.value}],
              })
            } else {
              feelings[findIDX].value+=strength;
              feelings[findIDX].scent.push({name: item.scent, value: strength});
            }

          })
          feelings = RecipeService.sortFeelingsByValue({feelings});

          /*
          feelings = scents.reduce((result, scent) => result.concat(scent.feelings), []);
          feelings = RecipeService.sortFeelingsByValue({feelings});
          sails.log("leagcy-feeling")
          sails.log(feelings);
          */

          /*
          let feelings = scents.reduce((result, scent) => result.concat(scent.feelings), []);
          feelings = RecipeService.sortFeelingsByValue({feelings});
          */

          return feelings;

        } catch (e) {
          throw e;
        }
      },
    },
    instanceMethods: {
      async checkCurrentUserLike({ currentUser }) {
        try {
          const userLikeRecipes = this.getDataValue('UserLikeRecipes') || [];
          this.currentUserLike = false;
          if (currentUser) {
            for(let i = 0; i < userLikeRecipes.length; i++) {
              const currentUserLikeThisRecipe = userLikeRecipes[i].UserId === currentUser.id;
              if (currentUserLikeThisRecipe) {
                this.currentUserLike = true;
                break;
              }
            }
          }
        } catch (e) {
          sails.log.error(e);
        }
      },
    },
    hooks: {
      beforeCreate: async (recipe) => {
        recipe.hashId = shortid.generate();
      },
    },
  },
};
