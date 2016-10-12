module.exports = {
  attributes: {
    filePath: {
      type: Sequelize.STRING,
    },
    size: {
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.STRING(30),
    },
    storage: {
      type: Sequelize.ENUM('local', 's3', 'url'),
      defaultValue: 'local',
    },
    fileName: {
      type: Sequelize.VIRTUAL,
      get: function() {
        // storage to local
        const thisFilePath = this.getDataValue('filePath');
        return thisFilePath.split('/uploads/')[1];

        // storage to S3
        return thisFilePath;
      }
    },
    url: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const thisFilePath = this.getDataValue('filePath');
          if (this.storage === 'local') {
            // return last part after split prevent install on
            // /public/cargocms or /public_html/cargocms will not return current path
            return thisFilePath.split('/.tmp/public').pop();
          } else if (this.storage ==='url') {
            return thisFilePath;
          } else if (this.storage ==='s3') {
            let split = thisFilePath.split('/');
            
            // check protocol
            if (!split[0]=='s3:') throw Error("non-S3 file but mark as S3");

            let bucket = split[2];
            let keyArray = split.slice(3,split.length);
            let fullKey = '';
            keyArray.forEach((element) => {
              if (fullKey=='') {
                fullKey += element;
              } else {
                fullKey += '/'+element;
              }
            });
            const fullURL = "https://"+bucket+".s3.amazonaws.com/"+fullKey;

            return fullURL;
          } else {
            throw Error('Not implemented');
          }
        } catch (e) {
          salis.log.error(e);
        }
      }
    }
  },
  associations: () => {},
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
