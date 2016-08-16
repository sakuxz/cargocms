module.exports = {

  isAuthenticated: function(req) {
    if (req.session.authenticated) {
      return true;
    } else {
      return false;
    }
  },

  getSessionUser: function(req) {
    if (req.session.passport != undefined && req.session.passport.user) {
      return req.session.passport.user;
    } else {
      return null;
    }
  },

  isAdmin: function(req) {

    let user = AuthService.getSessionUser(req);
    let isAdmin = false;
    user.Roles.forEach((role) => {
      if(role.authority == 'admin') isAdmin = true;
    });

    return isAdmin;
  }

}
