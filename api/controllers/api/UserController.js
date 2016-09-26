import crypto from 'crypto';

module.exports = {
  follow: async (req, res) => {
    try {
      const { id } = req.params;
      const loginUser = AuthService.getSessionUser(req);
      if (!loginUser) res.forbidden();
      const data = { follower: loginUser.id, following: id };
      await Follow.findOrCreate({
        where: data,
        defaults: data
      });
      res.ok({ message: `follow ${id} success.`, data: {} });
    } catch (e) {
      res.serverError(e);
    }
  },

  unfollow: async (req, res) => {
    try {
      const { id } = req.params;
      const loginUser = AuthService.getSessionUser(req);
      if (!loginUser) res.forbidden();
      await Follow.destroy({
        where: {
          follower: loginUser.id,
          following: id,
        },
      });
      res.ok({ message: `unfollow ${id} success.`, data: {} });
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      sails.log.info('update user controller id=>', id);
      sails.log.info('update user controller data=>', data);
      const { password, passwordConfirm } = data;
      const checkPwdEqual = password === passwordConfirm;

      if (checkPwdEqual) {
        const user = await UserService.updateByUser({
          id: id,
          ...data,
        });
        const checkLastName = user.lastName === data.lastName;
        const checkFirstName = user.firstName === data.firstName;
        const checkEmail = user.email === data.email;
        if (checkEmail && (checkFirstName && checkLastName)) {
          req.session.passport.user.displayName = user.displayName;
          req.session.passport.user.lastName = user.lastName;
          req.session.passport.user.firstName = user.firstName;
          req.session.passport.user.email = user.email;
          req.session.passport.user.local = user.local;
          req.session.passport.user.avatarThumb = user.avatarThumb;
          req.session.passport.user.avatar = user.avatar;
          res.send(req.session);
          // res.ok({
          //   message: 'Update user success.',
          //   data: user,
          // });
        } else {
          throw Error(`update user ${id} failed`);
        }
      } else {
        throw Error('error: user password and passwordConfirm is not equal!');
      }
    } catch (e) {
      res.serverError(e);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      sails.log.debug(req.wantsJSON);
      sails.log.debug(req.body);
      const { email } = req.body;
      let user = await User.findOne({
        where: { email }
      })
      if (!user) throw Error('請確認 Email，該 Email 尚未註冊過');

      const token = crypto.randomBytes(32).toString('hex').substr(0, 32);
      console.log("!!!!!!!", token);
      user.resetPasswordToken = token;
      await user.save();

      if (req.wantsJSON) {
        res.ok({ message: `forgot success. send email`, data: {} });
      } else {
        req.flash('info', '已給您發送重置密碼的連結，請至信箱確認');
        res.redirect('/login');
      }
    } catch (e) {
      if (req.wantsJSON) {
        res.serverError(e);
      } else {
        req.flash('error', e.message);
        res.redirect('/forgot');
      }
    }
  }

}
