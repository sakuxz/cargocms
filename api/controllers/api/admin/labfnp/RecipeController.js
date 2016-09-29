

module.exports = {

  export: async (req, res) => {
    try {
      let { query, options } = req;
      sails.log.info('export', query);
      const modelName = options.controller.split("/").reverse()[0];
      const content = await ExportService.query({ query, modelName });
      const columns = {
        id: 'ID',
        perfumeName: '香水名稱',
        authorName: '創作人',
        createdAt: '建立日期',
        visibilityDesc: '公開狀態',
        description: '香水描述',
        message: '額外資訊',
        scent0: '香味分子 1',
        scentml0: '香味分子 1 滴數',
        scentPercent0: '香味分子 1 比例',
        scent1: '香味分子 2',
        scentml1: '香味分子 2 滴數',
        scentPercent1: '香味分子 2 比例',
        scent2: '香味分子 3',
        scentml2: '香味分子 3 滴數',
        scentPercent2: '香味分子 3 比例',
        scent3: '香味分子 4',
        scentml3: '香味分子 4 滴數',
        scentPercent3: '香味分子 4 比例',
        scent4: '香味分子 5',
        scentml4: '香味分子 5 滴數',
        scentPercent4: '香味分子 5 比例',
        scent5: '香味分子 6',
        scentml5: '香味分子 6 滴數',
        scentPercent5: '香味分子 6 比例',
      }
      const format = (items) => {
        let result = items.map((data) => {
          let formatted = {
            id: data.id,
            perfumeName: data.perfumeName,
            authorName: data.authorName,
            createdAt: data.createdAt,
            visibilityDesc: data.visibilityDesc,
            description: data.description,
            message: data.message,
          }
          data.formula.forEach((formula, index) => {
            if (formula.scent && formula.drops > 0) {
              formatted[`scent${index}`] = `${formula.scent}`;
              formatted[`scentml${index}`] = `${formula.drops}`;
              formatted[`scentPercent${index}`] = Math.ceil(formula.drops / data.formulaTotalDrops * 10000)/10000;
            }
          });
          return formatted;
        });
        return result;
      }

      const result = await ExportService.export({
        fileName: modelName,
        content,
        format,
        columns,
      });
      res.attachment(result.fileName);
      res.end(result.data, 'UTF-8');
    } catch (e) {
      res.serverError(e);
    }
  },
}
