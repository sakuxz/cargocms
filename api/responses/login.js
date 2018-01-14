import urlGetter from 'url';
import _ from 'lodash';

/**
 * res.login([inputs])
 *
 * @param {action} auth callbacl action
 * @param {String} inputs.password
 *
 * @description :: Log the requesting user in using a passport strategy
 * @help        :: See http://links.sailsjs.org/docs/responses
 */

module.exports = async function login(role, inputs) {
  const params = inputs || {};
  const queryUrl = _.isNil(params.queryUrl) ? null : params.queryUrl;
  sails.log('====================================');
  sails.log('after login/register query url=>', queryUrl);
  sails.log('====================================');
  params.successRedirect = queryUrl || sails.config.urls.successRedirect || '/';
  params.siginedRedirect = queryUrl || sails.config.urls.siginedRedirect || '/';
  params.invalidRedirect = sails.config.urls.invalidRedirect || '/login';
  params.shouldVerifyEmail = sails.config.verificationEmail === 'true';

  sails.log('====================================');
  sails.log(`\n logined role=>"${role.toString().split(':')[1].replace(']', '')}"`);
  sails.log('\n params=>\n', params);
  sails.log('====================================');

  // Get access to `req` and `res`
  const req = this.req;
  const res = this.res;

  const tryAgain = (err) => {
    const flashError = req.flash('error')[0];
    if (err && !flashError) {
      req.flash('error', 'Error.Passport.Generic');
    } else if (!err && flashError) {
      req.flash('error', flashError);
    } else {
      req.flash('error', err.message);
    }
    req.flash('form', req.body);
    let reference = '';
    switch (params.action) {
      case 'register':
        return res.redirect('/register');

      case 'disconnect':
        return res.redirect('back');

      default:
        try {
          reference = urlGetter.parse(req.headers.referer);
        } catch (e) {
          reference = { path: '/' };
        }
        return res.redirect(reference.path);
    }
  };

  await passport.callback(role, req, res, (err, user, challenges, statuses) => {
    if (err || !user) {
      if (req.wantsJSON) {
        return res.negotiate({
          message: `Bad Request or Invalid username/password combination.(${err})`,
          error: err.message,
        });
      }
      return tryAgain(err);
    }

    return req.login(user, (loginErr) => {
      if (loginErr) {
        return tryAgain(loginErr);
      }
      req.session.authenticated = true;

      // update user lastLogin status
      const userAgent = req.headers['user-agent'];
      user.loginSuccess({ userAgent });

      let jsonMessage = '';
      let targetUrl = '';

      switch (params.action) {
        case 'register':
          if (params.shouldVerifyEmail) {
            if (req.wantsJSON) {
              return res.ok({
                message: 'Registered succeed, please verify your email and update profile.',
              });
            }
            req.flash('info', '註冊成功！請於信箱查收驗證信後補齊您的個人資料。');
            return res.redirect(params.siginedRedirect);
          }
          req.flash('info', '註冊成功！');
          jsonMessage = 'Registered succeed.';
          targetUrl = params.siginedRedirect;
          break;

        default:
          jsonMessage = 'Logined succeed.';
          targetUrl = params.successRedirect;
          break;
      }
      sails.log('====================================');
      sails.log('req.wantsJSON=>', req.wantsJSON);
      if (req.wantsJSON) {
        sails.log('req.session.needJwt=>', req.session.needJwt);
        try {
          const jwtToken = AuthService.getSessionEncodeToJWT(req);
          sails.log('Authorization(jwtToken)=>', jwtToken);
          return res.ok({
            success: true,
            message: jsonMessage,
            data: {
              Authorization: jwtToken,
              url: params.successRedirect,
            },
          });
        } catch (e) {
          sails.log.error(e);
          return res.negotiate(e);
        }
      }
      sails.log('====================================');
      return res.redirect(targetUrl);
    });
  });
};
