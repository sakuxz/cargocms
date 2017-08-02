/**
 * Authentication Controller
#
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
const url = require('url');
module.exports = {
  login: function(req, res) {
    try{
      const url = req.query.url || '/';
      if (req.session.authenticated) {
        return res.redirect(req.query.url);
      }

      let user = {
        identifier: '',
        password: ''
      }
      const form = req.flash('form')[0];
      if (form) user = form;

      res.ok({
        //layout: false,
        user,
        errors: req.flash('error'),
        url: req.query.url || '/lab',
      });
    } catch (e){
      sails.log.error(e);
      res.serverError(e);
    }
  },

  logout(req, res) {
    try {
      const isAuthenticated = req.session.authenticated;
      const user = AuthService.getSessionUser(req);
      sails.log(`=== logout === \nisAuthenticated:${isAuthenticated}\nuser=>${user}`)

      const configUrl = sails.config.urls.successRedirect || sails.config.urls.afterLogout;
      let redirectUrl = req.query.url || configUrl;
      let message = 'Logout succeed.';
      if (isAuthenticated || user) {
        req.session.authenticated = false;
        req.logout();
      } else {
        message = 'No needs to logout.';
        redirectUrl = '/';
      }
      if (req.wantsJSON) {
        return res.ok({
          success: true,
          message,
        });
      }
      return res.redirect(redirectUrl);
    } catch (e) {
      sails.log.error(e);
      return res.negotiate(e);
    }
  },

  provider: function(req, res) {
    sails.log('=== oauth login provider ===');
    try {
      const isAuthenticated = req.session.authenticated;
      const user = AuthService.getSessionUser(req);
      if (isAuthenticated || user) {
        sails.log.warn(`found logined user! force loging out user ${user.username}.`);
        req.session.authenticated = false;
        req.logout();
      }
      return passport.endpoint(req, res);
    } catch (e) {
      sails.log.error(e);
    }
  },

  register: async (req, res) => {
    if(req.session.authenticated) return res.redirect('/');
    try {
      let user = {
        username: '',
        email: '',
        lastName: '',
        firstName: '',
        birthday: '',
        phone1: '',
        phone2: '',
        address: '',
        address2: ''
      }
      let form = req.flash('form')[0];
      if(form) user = form;

      res.ok({
        user,
        errors: req.flash('error'),
        reCAPTCHAKey: sails.config.reCAPTCHA.key,
        url: req.query.url || '/lab',
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  status: (req, res) => {
    let authenticated = AuthService.isAuthenticated(req)
    let sessionUser = AuthService.getSessionUser(req)

    res.ok({authenticated, sessionUser});

  },

  async callback(req, res) {
    try {
      const queryUrl = req.query.url;
      const action = req.param('action');
      const email = _.deburr(_.toString(req.param('identifier'))).trim();
      const password = _.deburr(_.toString(req.param('password'))).trim();

      return res.login(User, {
        action,
        email,
        password,
        queryUrl,
      });
    } catch (e) {
      sails.log.error(e);
      return res.negotiate(e);
    }
  },

  disconnect: function(req, res) {
    passport.disconnect(req, res);
  },

  forgot: function(req, res) {
    try {
      res.ok({ view: true, reCAPTCHAKey: sails.config.reCAPTCHA.key });
    } catch (e) {
      res.serverError(e);
    }
  }

};
