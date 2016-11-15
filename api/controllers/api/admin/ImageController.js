module.exports = {
  upload: async(req, res) => {
    console.log("=== file upload ===");
    try {
      let storage = sails.config.storage;
      let storageLocate;
      if (storage) {
        storageLocate = storage.locate;
        let isS3 = storageLocate=="s3";
        let isLocal = storageLocate=="local";
        if ( isS3 || isLocal) {
          sails.log('storage config corrently');
        } else {
          sails.log.warn('storage config only accept "s3" and "local", please check config');
          storageLocate = 'local';
        }
      } else {
        sails.log.warn("storage config not defined, please check config");
        storageLocate = 'local';
      }

      let uploadParam;
      if (storageLocate=='local') {
        // local storage
        uploadParam = {
          dirname: '../../.tmp/public/uploads/'
        };
      } else if (storageLocate=='s3') {
        // s3 storage
        uploadParam = {
          adapter: require('skipper-s3'),
          ...sails.config.storage.s3
        };
      } else {
        throw('unknown storageLocation');
      }
      let promise = new Promise((resolve, reject) => {
        req.file('uploadPic').upload(uploadParam, async(err, files) => {
          resolve(files);
        });
      });
      let files = await promise.then();

      const { size, type, fd, extra } = files[0];
      const user = AuthService.getSessionUser(req);
      const UserId = user ? user.id : null;

      let filePath;
      if (storageLocate=='local') {
        filePath = 'file://'+fd;
      } else {
        filePath = 's3://'+extra.Bucket+'/'+extra.Key;
      }
      
      const upload = await Image.create(
        { filePath: filePath, 
          size, type, UserId, 
          storage: storageLocate 
        });

      res.ok({
        message: 'Upload Success',
        data: upload,
      });
    } catch (e) {
      res.serverError({
        // error 是 FineUploader 的格式
        error: e.message,
        message: e.message,
        data: {}
      });
    }
  },
  destroy: async (req, res) => {
    const user = AuthService.getSessionUser(req);
    const UserId = user ? user.id : null;
    sails.log.info('Not implemented');
    res.ok({
      message: 'Delete Success',
      data: true,
    });
  }
}
