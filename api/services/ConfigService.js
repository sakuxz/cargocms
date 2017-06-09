import _ from 'lodash';
module.exports = {

  sync: async() => {
    try {
      sails.log.info('sync model config & local config');
      let envCnfig = {};
      if (sails.config.environment === 'production') {
         envCnfig = require('../../config/env/production');
      } else if (sails.config.environment === 'development') {
        envCnfig = require('../../config/env/development');
      } else {
        envCnfig = require('../../config/env/test');
      }
      const localConfig = require('../../config/local');
      let modelAllConfig = await ConfigService.getModelJSONConfig();
      const allConfig = _.merge(
        envCnfig,
        localConfig,
        modelAllConfig
      );
      const pureJSONConfig = JSON.parse(JSON.stringify(allConfig));
      let formatConfig = ConfigService.jsonTOPath(pureJSONConfig);
      for(let data of formatConfig) {
        data = {
          ...data,
          key: data.key || '',
        }
        let modelConfig = await Config.findOne({
          where: {
            name: data.name,
            key: data.key
          }
        });
        if (modelConfig) {
          modelConfig.value = data.value;
          modelConfig.type = data.type;
          await modelConfig.save();
        } else {
          await Config.create(data);
        }
      }
      return true;
    } catch (e) {
      throw e;
    }
  },

  load: async() => {
    try {
      sails.log.info('update sails config');
      let modelConfig = await ConfigService.getModelJSONConfig();
      sails.config = _.merge(
        sails.config,
        modelConfig,
      )
      return true;
    } catch (e) {
      throw e;
    }
  },

  init: () => {

  },

  jsonTOPath: (data) => {
    try {
      sails.log.debug(data);
      let result = [];
      for (const key of Object.keys(data)) {
        if(_.isArray(data[key])){
          result.push({
            name: key,
            value: JSON.stringify(data[key]),
            type: 'array'
          });
        } else if (_.isObject(data[key])) {
          let formatObject = ConfigService.getPath(data[key], '', []);
          formatObject = formatObject.map((data) => {
            return {
              name: key,
              ...data,
            }
          });
          result = result.concat(formatObject);
        } else {
          result.push({
            name: key,
            value: data[key],
            type: 'text'
          });
        }
      }
      return result;
    } catch (e) {
      throw e;
    }
  },

  pathTOJSON: (data) => {
    try {
      const result = {};
      data.forEach((info) => {
        const name = info.name;
        result[name] = result[name] || {};
        if (info.key) {
          let pathArray = info.key.split('.');
          if (pathArray.length > 0) {
            const value = info.type === 'array' ? JSON.parse(info.value) : info.value;
            result[name] = ConfigService.arrayTOObject(result[name], pathArray, value);
          } else {
            const value = info.type === 'boolean' ? !!info.value : info.value;
            result[name] = value;
          }
        } else {
          const value = info.type === 'boolean' ? !!info.value : info.value
          result[name] = value;
        }
      })
      sails.log.info(result);
      return result;
    } catch (e) {
      throw e;
    }
  },


  getPath: (data, path, result) => {
    try {
      if(_.isEmpty(data)) {
        return result;
      } else {
        for (const key of Object.keys(data)) {
          if(_.isArray(data[key])){
            const value = data[key];
            result.push({
              key: `${path}${path ? '.': ''}${key}`,
              value: JSON.stringify(value),
              type: 'array'
            });
            delete data[key];
            return ConfigService.getPath(data, path, result);
          } else if (_.isObject(data[key])) {
            return ConfigService.getPath(data[key], `${path}${path ? '.': ''}${key}`, result)
          } else {
            const value = data[key];
            result.push({
              key: `${path}${path ? '.': ''}${key}`,
              value,
              type: 'text'
            });
            delete data[key];
            return ConfigService.getPath(data, path, result);
          }
        }
      }
    } catch (e) {
      throw e;
    }
  },

  arrayTOObject: (obj, keys, value) => {
    try {
      const lastKey = keys.pop();
      const lastObj = keys.reduce((obj, key) =>
          obj[key] = obj[key] || {},
          obj);
      lastObj[lastKey] = value;
      return obj;
    } catch (e) {
      throw e;
    }
  },

  getModelJSONConfig: async() => {
    try {
      let modelConfig = await Config.findAll();
      modelConfig = modelConfig.map((data) => {
        return data.toJSON();
      })
      modelConfig = ConfigService.pathTOJSON(modelConfig);
      return modelConfig;
    } catch (e) {
      throw e;
    }
  }

}
