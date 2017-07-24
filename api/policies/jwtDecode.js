/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
import jwt from 'jsonwebtoken';

module.exports = function (req, res, next) {
  try {
    let token = req.headers['jwt-token'];
    sails.log('====================================');
    sails.log('JwtDecode token=>', token);
    sails.log('====================================');
    if (typeof token !== 'undefined' && token) {
      if (token.includes('Bearer')) {
        token = token.replace('Bearer ', '');
      }
      const decoded = jwt.verify(token, 'secret');
      sails.log('decoded jwt resule=>', decoded);
      req.session.authenticated = true;
      req.session.passport = {
        user: {
          ...decoded,
        },
      };
    }
    return next();
  } catch (err) {
    sails.log.error(err);
    return next();
  }
};
