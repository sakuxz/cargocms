import _ from 'lodash';
const assert = require('assert');

module.exports = {

  checkParams(role, customData, username) {
    // console.log('====================================');
    // console.log('\n checkRequiredParams customData=>', customData);
    // console.log('====================================');
    const d = customData;
    try {
      const roleName = RoleService.getRoleName(role);
      switch (roleName) {
        case 'user':
          return UtilsService.checkRequiredParams([
            // 放要檢查是否為空的 user 資料欄位
          ]);

        default:
          throw new Error('needs to target a role model name!');
      }
    } catch (e) {
      throw e;
    }
  },

};
