import stringify from 'csv-stringify';
var nodeExcel = require('excel-export');
import moment from 'moment';
import fs from 'fs';
import iconv from 'iconv-lite';

module.exports = {
  query: async ({ query, modelName, include }) => {
    try {
      let findQuery = FormatService.getQueryObj(query);
      if (include) {
        include = FormatService.getIncudeQueryObj({ include, query });
        findQuery.include = include;
      }
      delete findQuery.offset;
      delete findQuery.limit;
      sails.log.debug(findQuery);
      const result =  await sails.models[modelName].findAll(findQuery);
      return result.map((data) => data.toJSON());
    } catch (e) {
      throw e;
    }
  },

  export: async ({format, content, fileName, columns}) => {
    try {
      if (format) {
        content = format(content);
      }
      sails.log.debug(content);
      let dataString = await new Promise((defer, reject) => {
        stringify(content, { header: !!columns, columns }, function(err, output){
          if (err) reject(err);
          defer(output);
        });
      });
      sails.log.debug(dataString);
      dataString = "\uFEFF" + dataString
      const encoding = 'utf-8';
      let dataBuffer = new Buffer(dataString);
      dataBuffer = iconv.encode(dataBuffer, encoding);
      const time = moment(new Date()).format("YYYYMMDDHHmmSS");
      fileName = `${fileName || ''}${time}.csv`;
      const filePath = `${__dirname}/../../.tmp/${fileName}`;
      // await fs.writeFileSync(filePath, dataBuffer);

      return { filePath, fileName, data: dataBuffer};
    } catch (e) {
      throw e;
    }
  },

  exportExcel: async ({format, content, fileName, columns}) => {
    try {
      // if (format) {
      //   content = format(content);
      // }
      // sails.log.debug(content);
      // let dataString = await new Promise((defer, reject) => {
      //   stringify(content, { header: !!columns, columns }, function(err, output){
      //     if (err) reject(err);
      //     defer(output);
      //   });
      // });
      // sails.log.debug(dataString);
      // dataString = "\uFEFF" + dataString
      // const encoding = 'utf-8';
      // let dataBuffer = new Buffer(dataString);
      // dataBuffer = iconv.encode(dataBuffer, encoding);
      // const time = moment(new Date()).format("YYYYMMDDHHmmSS");
      // fileName = `${fileName || ''}${time}.csv`;
      // const filePath = `${__dirname}/../../.tmp/${fileName}`;
      // await fs.writeFileSync(filePath, dataBuffer);

      var conf ={};
      // conf.stylesXmlFile = `${__dirname}/styles.xml`;
      conf.name = "mysheet";
      conf.cols = [{
        caption: '測試',
        type: 'string',
      }];
      conf.rows = [
        ["周咏蒨"],
        ["등원청"],
        ["訂購者"],
        ["안갯길"],
        ["羅筑儀"],
        ["香港尖沙咀金马伦道48号中国保险大厦15楼B室"],
        ["20life LM•BU•WH"],
      ];
      var result = nodeExcel.execute(conf);
      // let dataBuffer = new Buffer(result);
      const time = moment(new Date()).format("YYYYMMDDHHmmSS");
      fileName = `${fileName || ''}${time}.xlsx`;
      const filePath = `${__dirname}/../../.tmp/${fileName}`;
      await fs.writeFileSync(filePath, result, 'binary');

      return { filePath, fileName, data: dataBuffer};
    } catch (e) {
      throw e;
    }
  },
}
