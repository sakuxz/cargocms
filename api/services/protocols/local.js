import crypto from 'crypto';
import axios from 'axios';
import _ from 'lodash';
import validator from 'validator';

exports.register = async (roleModel, req, res, next) => {
  // switch for detect the request is from mobile API or form sumbit.
  const isApi = req.param('api') || false;
  if (!isApi) {
    await UtilsService.checkRecaptcha(req.body);
  }
  const {
    email,
    username,
    password,
    lastName,
    firstName,
    birthday,
    phone1,
    phone2,
    address,
    address2,
    customData,
  } = req.body;

  // sails.log('====================================');
  // sails.log('\n req.body=>', req.body);
  // sails.log('====================================');
  try {
    const verifyEmailToken = crypto.randomBytes(32).toString('hex').substr(0, 32);

    // verify if meet the necessary parameters or not.
    UtilsService.checkRequiredParams([{ email }, { password }]);

    const userData = {
      username: username || email,
      password,
      email,
      lastName,
      firstName,
      birthday,
      phone1,
      phone2,
      address,
      address2,
      verifyEmailToken,
      role: roleModel,
    };

    // create basic user with userData. if customData field is null or empty
    // then will just create basic user, without any releated model.
    let newUser = {};
    if (!_.isNil(customData)) {
      // check and translate the input customData from string into object.
      let data = customData || {};
      if (!_.isObject(customData) && _.isString(customData)) {
        data = JSON.parse(customData);
      }

      // if exists customData field then try to verfiy it
      // by using customized ValidationService.checkParams().
      const hasParams = ValidationService.checkParams(roleModel, data, username);
      if (hasParams) {
        console.log(userData)
        console.log(data)
        const basicUser = await UserService.register(userData);
        newUser = await AuthService.customRegister(basicUser, data);
      }
    } else {
      newUser = await UserService.register(userData);
    }
    return next(null, newUser);
  } catch (err) {
    sails.log.error(err.stack);
    if (_.isArray(err.errors)) {
      req.flash('error', err.errors[0].message);
    } else {
      req.flash('error', err);
    }
    return next(err);
  }
};

exports.connect = async (req, res, next) => {
  console.info("=== protocol local connect ===");
  var password, user;
  user = req.user;
  password = req.param('password');

  try {
    let passport = await Passport.find({
      protocol: 'local',
      UserId: user.id
    });
    if (!passport) {
      await Passport.create({
        protocol: 'local',
        password: password,
        UserId: user.id
      });
    }
    ext(null, user);

  } catch (e) {
    return next(e);
  }
};

exports.login = async (req, identifier, password, next) => {
  sails.log.info('=== protocol local login ===');
  const query = {
    where: {},
    include: [Role],
  };
  try {
    const isEmail = validator.isEmail(identifier);
    if (isEmail) {
      query.where.email = identifier;
    } else {
      query.where.username = identifier;
    }

    const user = await User.findOne(query);
    if (user) {
      sails.log('== user ==\n', user.toJSON());
    } else {
      sails.log('======\n no any user has been logined.\n===');
      if (isEmail) {
        throw new Error('Error.Passport.Email.NotFound');
      } else {
        throw new Error('Error.Passport.Username.NotFound');
      }
    }
    // console.log("== user ==", user.toJSON());

    const passport = await Passport.findOne({
      where: {
        UserId: user.id,
      },
    });
    if (passport) {
      const result = await passport.validatePassword(password);
      if (result) {
        const userAgent = req.headers['user-agent'];
        await user.loginSuccess({ userAgent });
        return next(null, user);
      }
      throw new Error('Error.Passport.Password.CheckFail');
    } else {
      throw new Error('Error.Passport.Password.NotSet');
    }
  } catch (e) {
    sails.log.error(e.stack);
    req.flash('error', 'Error.Passport.BadUserPassword');
    return next(e);
  }
};
