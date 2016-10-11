module.exports = {
  index: async (req, res) => {
    try {
      const data = {};
      res.view('contact/index', {
        data: {
          user: AuthService.getSessionUser(req) || {},
          reCAPTCHAKey: sails.config.reCAPTCHA.key,
        }
      });
    } catch (e) {
      res.serverError(e);
    }
  },
}
