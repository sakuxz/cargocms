module.exports = {

  find: async (req, res) => {
    try {
      let {query} = req
      let {serverSidePaging} = query
      let modelName = req.options.controller.split("/").reverse()[0]
      let result;
      if(serverSidePaging){
        result = await PagingService.process({query, modelName});
      }else {
        const items = await sails.models[modelName].findAll();
        result = {data: {items}}
      }
      res.ok(result);
    } catch (e) {
      res.serverError(e);
    }
  },

  findOne: async (req, res) => {
    console.log("=== findOne ===");
    const { id } = req.params;
    try {
      const user = await User.findOneWithPassport({id})
      sails.log.info('get user =>', user);
      res.ok({
        message: 'Get user success.',
        data: user,
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  create: async (req, res) => {
    const data = req.body;
    try {
      sails.log.info('create user controller=>', data);
      const user = await UserService.create(data);

      const checkCreatedResult = user.username === data.username;
      if (checkCreatedResult) {

        res.ok({
          message: 'Create user success.',
          data: user,
        });
      } else {
        
        req.flash('新增使用者失敗，請檢查使用者名稱/信箱是否重複！');
      }
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      sails.log.info('update user controller id=>', id);
      sails.log.info('update user controller data=>', data);
      const user = await UserService.update({
        id: id,
        ...data,
      });
      res.ok({
        message: 'Update user success.',
        data: user,
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      sails.log.info('delete user controller=>', id);
      const user = await User.deleteById(id);
      res.ok({
        message: 'Delete user success.',
        data: user,
      });
    } catch (e) {
      res.serverError(e);
    }
  }
}
