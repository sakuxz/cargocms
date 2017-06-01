import jwt from 'jsonwebtoken';

module.exports = {

  isAuthenticated(req) {
    if (req.session.authenticated) {
      return true;
    } else {
      return false;
    }
  },

  getSessionUser(req) {
    if (req.session.passport != undefined && req.session.passport.user) {
      return req.session.passport.user;
    } else {
      return null;
    }
  },

  isAdmin(req) {
    const user = AuthService.getSessionUser(req);
    let authority = false;
    if (user && user.Roles) {
      user.Roles.forEach((role) => {
        if (role.authority === 'admin') authority = true;
      });
    }
    return authority;
  },

  isUser(req) {
    const user = AuthService.getSessionUser(req);
    let authority = false;
    if (user && user.Roles) {
      user.Roles.forEach((role) => {
        if (role.authority === 'user') authority = true;
      });
    }
    return authority;
  },

  isOnlyUser(req) {
    const user = AuthService.getSessionUser(req);
    let authority = true;
    if (user && user.Roles) {
      user.Roles.forEach((role) => {
        if (role.authority !== 'user') authority = false;
      });
    } else {
      authority = false;
    }
    return authority;
  },

  getSessionEncodeToJWT(req) {
    const user = AuthService.getSessionUser(req);
    let jwtToken = '';
    if (user) {
      const isWebView = AuthService.isWebView(req.headers['user-agent']);
      if ((req.session.needJwt || isWebView) && user) {
        try {
          jwtToken = jwt.sign((user.toJSON()), 'secret');
        } catch (e) {
          sails.log.error(e);
          throw new Error(e);
        }
      }
      req.session.needJwt = false;
    }
    return jwtToken;
  },

  isWebView(userAgent) {
    return userAgent.indexOf('React-Native') !== -1;
  },
  
  /**
   * 用來檢查 user 的 roles 是否符合給予的 roles 陣列。
   * @method
   * @param {Request}
   * @param {String[]} targetRoles - role 的名稱。
   * return {String[]} 符合的 roles 陣列
   */
  matchedRoles(req, targetRoles) {
    const user = AuthService.getSessionUser(req);
    let matched = [];
    targetRoles = targetRoles.map((role) => role.toLowerCase());
    if (user && user.Roles) {
        return matched = user.Roles.filter((role) => 
          targetRoles.indexOf(role.authority.toLowerCase()) !== -1);
    }
    return [];
  },

  /**
   * 用來檢查 user 的 roles 是否符合給予的 roles 陣列。
   * @method
   * @param {Request}
   * @param {String[]} targetRoles - role 的名稱。
   * return {Boolean} user role 是否符合 targetRoles 陣列
   */
  isMatchedRoles(req, targetRoles) {
    return AuthService.matchedRoles(req, targetRoles).length > 0;
  },

  async customRegister(newUser, customData) {
    let targetRole = '';
    try {
      // TODO remove return=false to enable CustomLogin method.
      targetRole = newUser.Roles[0].authority;
      // console.log('!!!!! newUser.Roles=>', newUser.Roles);
      // console.log('!!!!! targetRole=>', targetRole);
      // console.log('!!!!! customData=>', customData);
      switch (targetRole) {
        default:
          throw new Error('needs to target a role model name!');
      }
    } catch (e) {
      await User.destroy({ where: { id: newUser.id }, force: true });
      sails.log('====================================');
      sails.log(`\n User id '${newUser.id}' destroyed because '${targetRole}' create failed.`);
      sails.log('====================================');
      sails.log.error(e);
      throw e;
    }
  },

  async customLogin(user, customData) {
    try {
      let data = customData || {};
      if (!_.isObject(inputs) && _.isString(inputs)) {
        data = JSON.parse(inputs);
      }
      // TODO remove return=false to enable CustomLogin method.
      return false;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

};