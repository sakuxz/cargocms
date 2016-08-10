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
    res.view({}, "auth/login");
  },
  logout: function(req, res) {
    req.session.authenticated = false;
    req.logout();
    return res.redirect('/');

  },
  provider: function(req, res) {
    try {
      passport.endpoint(req, res);
    } catch (e) {
      sails.log.error(e);
    }
  },
  register: async (req, res) => {
    try {
      let user = {
        username: '',
        email: '',
        lastName: '',
        firstName: '',
      }
      let form = req.flash('form')[0];
      if(form) user = form;

      res.ok({user, errors: req.flash('error')});
    } catch (e) {
      res.serverError(e);
    }
  },
  status: (req, res) => {
    let authenticated = AuthService.isAuthenticated(req)
    let sessionUser = AuthService.getSessionUser(req)

    res.ok({authenticated, sessionUser});

  },
  callback: async function(req, res) {

    var tryAgain = function(err) {

      var action, flashError;
      flashError = req.flash('error')[0];
      if (err && !flashError) {
        req.flash('error', 'Error.Passport.Generic');
      } else if (flashError) {
        req.flash('error', flashError);
      }
      req.flash('form', req.body);
      action = req.param('action');
      switch (action) {
        case 'register':
          res.redirect('/register');
          break;
        case 'disconnect':
          res.redirect('back');
          break;
        default:
          var reference;
          try {
            reference = url.parse(req.headers.referer);
          } catch (e) {

            reference = { path : "/" };
          }

          res.redirect(reference.path);
      }
    };

    await passport.callback(req, res, function(err, user, challenges, statuses) {
      console.info('=== callback user ===', user);
      console.info('=== passport.callback ===', err);
      
      if (err || !user) {
        return tryAgain(err);
      }

      req.login(user, function(err) {
        if (err) {
          return tryAgain(err);
        }
        req.session.authenticated = true;
        return res.redirect(req.query.url || sails.config.urls.afterSignIn);
      });
    });
  },

  disconnect: function(req, res) {
    passport.disconnect(req, res);
  }

};
