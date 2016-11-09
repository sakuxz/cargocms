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
      await fs.writeFileSync(filePath, dataBuffer);

      return { filePath, fileName, data: dataBuffer};
    } catch (e) {
      throw e;
    }
  },

  exportExcel: async ({format, content, fileName, columns}) => {
    try {
      if (format) {
        content = format(content);
      }
      let conf = {};
      // conf.name = fileName; //試算表內的表格名稱，不能為中文
      conf.cols = columns;
      conf.rows = content;

      // conf.stylesXmlFile = `${__dirname}/styles.xml`;
      var result = nodeExcel.execute(conf);
      let dataBuffer = new Buffer(result, 'binary');
      const time = moment(new Date()).format("YYYYMMDDHHmmSS");
      fileName = `${fileName || ''}${time}.xlsx`;
      const filePath = `${__dirname}/../../.tmp/${fileName}`;
      await fs.writeFileSync(filePath, result, 'binary');

      return { filePath, fileName, data: dataBuffer};
    } catch (e) {
      throw e;
    }
  },

  downloadExport: async(fileName) => {
    try {
      const filePath = `${__dirname}/../../.tmp/${fileName}`;
      var buffer = fs.readFileSync(filePath);
      return buffer;
    } catch (e) {
      throw e;
    }
  }
}
