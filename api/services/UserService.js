import jwt from 'jsonwebtoken';
import moment from 'moment';

module.exports = {
    async register(userData) {
    try {
      // sails.log('====================================');
      // sails.log('\n userData=>', userData);
      // sails.log('====================================');

      // check if the user is exist.
      const existUser = await User.find({
        where: {
          $or: [
            { email: userData.email },
            { username: userData.username },
          ],
        },
      });
      if (existUser) {
        throw new Error('the email or user name has been registered.');
      }

      // create User
      if(userData.birthday === '') delete userData.birthday
      let user = await User.create(userData);
      if (!user) {
        throw new Error('create User failed.');
      }

      // create User's passport
      const passport = await Passport.create({
        provider: 'local',
        protocol: 'local',
        password: userData.password,
        UserId: user.id,
      });
      if (!passport) {
        throw new Error('create user Passport failed.');
      }

      // add Role
      const roleName = RoleService.getRoleName(userData.role);
      const userRole = await Role.findOrCreate({
        where: { authority: roleName },
        defaults: {
          authority: roleName,
          title: roleName,
          description: `${roleName} user`,
        },
      });
      if (!userRole[0]) {
        throw new Error('create Role failed.');
      }
      await Promise.all(userRole.map(async (role) => {
        await user.addRole(role);
      }));

      // get user with role
      user = await User.findOne({
        where: {
          id: user.id,
        },
        include: [Role],
      });
      await this.sendVerificationEmail({
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        signToken: userData.verifyEmailToken,
        type: '註冊',
      });

      return user;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  findAll: async () => {
    try {
      return await User.findAll();
    } catch (e) {
      throw e;
    }
  },

  create: async ({
    username,
    email,
    firstName,
    lastName,
    locale,
    Passports,
    birthday,
    phone1,
    phone2,
    address,
    address2
  }) => {
    try {
      sails.log.info({
        username,
        email,
        firstName,
        lastName,
        locale,
        Passports,
        birthday,
        phone1,
        phone2,
        address,
        address2
      });
      const findExistUser = await User.find({
        where: { $or: [ {username}, {email} ] }
      });

      if (findExistUser)
        throw new Error(`user ${findExistUser.username} exist!`);

      const user = await User.create({
        username,
        email,
        firstName,
        lastName,
        locale,
        birthday: birthday === '' ? null : birthday,
        phone1,
        phone2,
        address,
        address2
      });
      await Passport.create({
        provider: 'local',
        password: Passports[0].password,
        UserId: user.id
      });

      return user;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  update: async (user = {
    id,
    username,
    email,
    firstName,
    lastName,
    locale,
    Passports,
    rolesArray,
    birthday,
    phone1,
    phone2,
    address,
    address2
  }) => {
    try {
      sails.log.info('update user service=>', user);
      let updatedUser = await User.findOne({
        where: {
          id: parseInt(user.id, 10)
        },
        include: Passport,
      });
      if (updatedUser) {
        const passport = await Passport.findById(updatedUser.Passports[0].id);
        const isOldPassword = await passport.validatePassword(user.Passports[0].password);
        if (!isOldPassword) {
          passport.password = user.Passports[0].password;
          await passport.save();
        }
        updatedUser.username = user.username;
        updatedUser.email = user.email;
        updatedUser.firstName = user.firstName;
        updatedUser.lastName = user.lastName;
        updatedUser.locale = user.locale;
        updatedUser.phone1 = user.phone1;
        updatedUser.phone2 = user.phone2;
        updatedUser.address = user.address;
        updatedUser.address2 = user.address2;

        if( user.birthday !== "" ){
          updatedUser.birthday = user.birthday;
        }

        const userRoles = await Role.findAll({
          where: {
            authority: user.rolesArray
          }
        });
        await updatedUser.setRoles(userRoles);
        updatedUser = await updatedUser.save();
      }
      return updatedUser;
    } catch (e) {
      throw e;
    }
  },

  updateByUser: async (user = {
    id,
    username,
    email,
    firstName,
    lastName,
    locale,
    Passports,
    password,
    passwordConfirm,
    verificationEmailToken,
    avatarImgId,
  }) => {
    try {
      sails.log.info('updateByUser service=>', user);
      let updatedUser = await User.findOne({
        where: {
          id: parseInt(user.id, 10)
        },
        include: Passport,
      });
      if (updatedUser) {
        const checkPwdNotEmpty = user.password !== '';
        if (checkPwdNotEmpty) {

          const checkPwdAreEqual = user.password === user.passwordConfirm;
          if (checkPwdAreEqual) {

            const passport = await Passport.findById(updatedUser.Passports[0].id);
            passport.password = user.password;
            await passport.save();
          }
        }

        if(user.avatarImgId){
          const userAvatar = await Image.findById(user.avatarImgId);
          user.avatar = userAvatar.url;
          user.avatarThumb = userAvatar.url;
        }

        updatedUser.username = user.username;
        updatedUser.email = user.email;
        updatedUser.firstName = user.firstName;
        updatedUser.lastName = user.lastName;
        updatedUser.locale = user.locale;
        updatedUser.phone1 = user.phone1;
        updatedUser.phone2 = user.phone2;
        updatedUser.address = user.address;
        updatedUser.address2 = user.address2;
        updatedUser.verificationEmailToken = user.verificationEmailToken;
        updatedUser.avatar = user.avatar;
        updatedUser.avatarThumb = user.avatarThumb;

        if (user.birthday !== '') {
          updatedUser.birthday = user.birthday;
        }

        updatedUser = await updatedUser.save();
      }
      return updatedUser;
    } catch (e) {
      throw e;
    }
  },

  sendVerificationEmail: async({ userId, email,  displayName, signToken, type}) => {
    try {
      const token = jwt.sign({
        exp: moment(new Date()).add(1, 'h').valueOf(),
        userId,
        email,
      }, signToken);
      let messageConfig = await MessageService.checkNewEmail({
        email: email,
        api: `validate/email?token=${token}`,
        username: displayName,
        type: type,
      });
      let message = await Message.create(messageConfig);
      await MessageService.sendMail(message);
    } catch (e) {
      throw e;
    }
  }
}
