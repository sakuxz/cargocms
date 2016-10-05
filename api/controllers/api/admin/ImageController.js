module.exports = {
  upload: async(req, res) => {
    console.log("=== file upload ===");
    try {

      /*
      // local storage
      const dirname = '../../.tmp/public/uploads/';
      let promise = new Promise((resolve, reject) => {
        req.file('uploadPic').upload({ dirname }, async(err, files) => {
          resolve(files);
        });
      });
      let files = await promise.then();

      const { size, type, fd } = files[0];
      const user = AuthService.getSessionUser(req);
      const UserId = user ? user.id : null;
      const upload = await Image.create({ filePath: fd, size, type, UserId });
      */

      // aws S3 Upload
      let info;
      let promise = new Promise((resolve, reject) => {
        req.file('uploadPic').upload({
          adapter: require('skipper-s3'),
          key: 'api key',
          secret: 'api key secret',
          // Bucket must on US Standard, or settting at region
          // or EXPLOSION with TypeError / InvalidRequest
          bucket: 'dd-han-hello-us'
        }, (err, filesUploaded) => {
          if (err) {
            reject(err);
          } else {
            resolve(filesUploaded);
          }
        
        });
      });
      let files = await promise.then();

      const { size, type, fd, extra } = files[0];
      const user = AuthService.getSessionUser(req);
      const UserId = user ? user.id : null;
      const upload = await Image.create({ filePath: extra.Location, size, type, UserId, storage:'s3' });

      console.log(files[0]);
      console.log(upload);

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
    sails.log.info('Not implemented');
    res.ok({
      message: 'Delete Success',
      data: true,
    });
  }
}
