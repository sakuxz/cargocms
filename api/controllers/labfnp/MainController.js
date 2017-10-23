import jwt from 'jsonwebtoken';
import moment from 'moment';

module.exports = {

  index: async (req, res) => {
    res.view('index', {
      layout: 'layout.index',
      layoutImages: {
        icon1: sails.config.layoutImages.icon1[0],
        icon2: sails.config.layoutImages.icon2[0],
        icon3: sails.config.layoutImages.icon3[0],
        slides1: sails.config.layoutImages.slides1[0],
        slides2: sails.config.layoutImages.slides2[0],
        slides3: sails.config.layoutImages.slides3[0],
        slidesm1: sails.config.layoutImages.slidesm1[0],
        slidesm2: sails.config.layoutImages.slidesm2[0],
        slidesm3: sails.config.layoutImages.slidesm3[0],
        backgroundImage1: sails.config.layoutImages.backgroundImage1[0],
        backgroundImage2: sails.config.layoutImages.backgroundImage2[0],
        backgroundImage3: sails.config.layoutImages.backgroundImage3[0],
        avatar: sails.config.layoutImages.avatar[0],
      },
    });
  },

  async explore(req, res) {
    try {
      const { userId, search } = req.query;
      const currentUser = AuthService.getSessionUser(req);

      const recipes = await Recipe.findAndIncludeUserLike({
        findByUserId: userId,
        currentUser,
        start: 0,
        length: 100,
        likeUser: req.query.type === 'like' ? currentUser : null,
        search,
      });

      const social = SocialService.forRecipe({ recipes });

      return res.view({ recipes, social });
    } catch (e) {
      res.serverError(e);
    }
  },

  async editPofile(req, res) {
    const user = null;
    const isMe = false;
    try {
      const { id } = req.params;
      const loginUser = AuthService.getSessionUser(req);
      if (!loginUser) return res.redirect('/login');

      const user = await User.findOneWithPassport({ id: loginUser.id });
      if (user.verificationEmailToken) {
        req.flash('info', '您更新了 Email ，請至新信箱點擊認證連結');
      }
      return res.view({
        user,
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  async portfolio(req, res) {
    let user = null;
    let isMe = false;
    try {
      const { id } = req.params;
      const loginUser = AuthService.getSessionUser(req);

      let score = 0;
      if (id) {
        user = await User.findOne({ where: { id } });
        if (!user) return res.notFound('查無使用者');
        score = user.score;
      } else {
        user = loginUser;
        if (!user) return res.redirect('/login');

        user = await User.findById(loginUser.id);
        const userRecipes = await Recipe.findAll({ where: { UserId: user.id } });
        const userRecipesIds = userRecipes.map(recipe => recipe.id);
        score = await UserLikeRecipe.count({ where: { RecipeId: userRecipesIds } });
        user.score = score;
        await user.save();
      }
      isMe = (loginUser && (loginUser.id == user.id));

      let notShowPrivateRecipe = {};
      if (!isMe) notShowPrivateRecipe = { visibility: { $not: 'PRIVATE' } };

      const recipes = await Recipe.findAll({
        where: {
          UserId: user.id,
          ...notShowPrivateRecipe,
        },
        order: 'Recipe.updatedAt desc',
        include: Image,
      });

      const followers = await Follow.count({ where: { following: user.id } });
      const favorited = await UserLikeRecipe.count({ where: { UserId: user.id } });
      const following = await Follow.count({ where: { follower: user.id } });
      let isFollowing = false;
      if (loginUser) {
        isFollowing = await Follow.findOne({
          where: {
            follower: loginUser.id,
            following: user.id,
          },
        });
      }

      return res.view({
        user,
recipes,
followers,
favorited,
following,
isMe,
score,
        isFollowing: !!isFollowing,
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  async updatePassword(req, res) {
    try {
      const { token } = req.query;
      res.ok({ token });
    } catch (e) {
      res.serverError(e);
    }
  },

  validateEmail: async (req, res) => {
    try {
      const { token } = req.query;
      const decoded = jwt.decode(token);

      if (!decoded) {
        sails.log.error('Email 驗證 token 不合法');
        return res.notFound();
      }

      const timeout = moment(new Date()).valueOf() > decoded.exp;
      let message = '';
      let valid = false;

      // if (timeout) throw Error('驗證連結已逾時');
      if (timeout) {
        message = 'E-Mail 驗證連結已逾時';
        sails.log.error('E-Mail 驗證連結已逾時');
      } else {
        const user = await User.findOne({
          where: {
            id: decoded.userId,
            email: decoded.email,
          },
        });
        // if (!user.verificationEmailToken) throw Error('請點擊 Email 驗證連結');
        if (!user.verificationEmailToken) {
          message = '此驗證連結已失效';
          sails.log.error('此驗證連結已失效');
        } else {
          jwt.verify(token, user.verificationEmailToken);
          user.verificationEmailToken = '';
          await user.save();

          if (AuthService.isAuthenticated(req)) {
            req.session.passport.user.verificationEmailToken = '';
            // res.send(req.session);
          }

          req.flash('info', '您更新了 Email ，請至新信箱點擊認證連結');
          message = 'E-Mail 驗證成功';
          valid = true;
        }
      }

      res.ok({
        message,
        valid,
      });
    } catch (e) {
      res.serverError(e);
    }
  },
};
