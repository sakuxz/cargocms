import _ from 'lodash';

module.exports = {

  getUserAllRole: async({ user }) => {
    try {
      // sails.log.info(roles, model, roleDetailName);
      const findUser = await User.findOne({
        where: {
          id: user.id
        },
        include: Role,
      })
      const rolesId = findUser.Roles.map((data) => data.id);
      let roleDetail = await RoleDetail.findAll({
        where: {
          RoleId: rolesId,
        },
        include: MenuItem
      });
      roleDetail = roleDetail.map((data) => data.dataValues);
      return roleDetail;
    } catch (e) {
      throw e;
    }
  },

  hasRole: function(user, roleName) {
  },

  hasRoleDetail: function(user, roleName) {
  },

  getAccessibleMenuItems: function({ roles }) {
  },

  hasRoleDetailOfMenuItem: function({ roles, model, roleDetailName }) {
    try {

      const menuItem = roles.filter((data) => {
        return _.isMatch(data, {
          name: roleDetailName,
          MenuItem: {
            dataValues: {
              model: model
            }
          }
        })
      });
      //console.log(menuItem);
      return menuItem.length > 0;
    } catch (e) {
      throw e;
    }
  },

  canAccessApi: function(user, menuItem, httpMethod, apiPath) {
  },

  getRoleName(role) {
    try {
      return role.toString().split(':')[1].replace(']', '').toLowerCase();
    } catch (e) {
      throw e;
    }
  },

};
