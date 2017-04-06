import moment from 'moment';

module.exports = {

  find: async (req, res) => {
    try {
      // const { query } = req;
      const { serverSidePaging } = req.query;
      const query = req.body;
      const modelName = req.options.controller.split("/").reverse()[0];
      let result;
      if (serverSidePaging) {
        const include = {
          model: RecipeOrder,
          include: [User, Recipe]
        }
        result = await PagingService.process({ query, modelName, include });
      } else {
        const items = await sails.models[modelName].findAll({
          include:{
            model: RecipeOrder,
            include: [User, Recipe]
          }
        });
        result = { data: { items } };
      }
      res.ok(result);
    } catch (e) {
      res.serverError(e);
    }
  },

  findOne: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Allpay.findOne({
        where:{
          id
        },
        include:{
          model: RecipeOrder,
          include: [User, Recipe]
        }
       });
      res.ok({ data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const message = 'Update success.';
      //allpay , recipeOrder 分拆更新資料
      // const allpayData = {
      //   TradeNo: data.TradeNo,
      //   MerchantTradeNo: data.MerchantTradeNo,
      //   RtnCode: data.RtnCode,
      //   RtnMsg: data.RtnMsg,
      //   PaymentDate: data.PaymentDate,
      //   TradeDate: data.TradeDate,
      //   PaymentType: data.PaymentType,
      //   ShouldTradeAmt: data.ShouldTradeAmt,
      //   TradeAmt: data.TradeAmt,
      //   BankCode: data.BankCode,
      //   vAccount: data.vAccount,
      //   ExpireDate: data.ExpireDate,
      //   PaymentNo: data.PaymentNo,
      //   Barcode1: data.Barcode1,
      //   Barcode2: data.Barcode2,
      //   Barcode3: data.Barcode3,
      //   CheckMacValue: data.CheckMacValue,
      //   MerchantTradeDate: data.MerchantTradeDate,
      //   RecipeOrderId: data.RecipeOrderId,
      // };
      const recipeData = {
        recipient: data.Recipient,
        address: data.Address,
        phone: data.Phone,
        email: data.Email,
        note: data.Note,
        remark: data.Remark,
        productionStatus: data.RecipeOrder.productionStatus,
        shipping: data.shipping,
        trackingNumber: data.trackingNumber,
      };

      // const allpay = await Allpay.update(allpayData ,{
      //   where: { id, },
      // });

      const order = await RecipeOrder.update(recipeData, {
        where: { id: data.RecipeOrderId, },
      });

      res.ok({ message, data: { order } });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const recipeOrder = await Allpay.findOne({
        where:{
          id
        },
        include:{
          model: RecipeOrder,
          include: [User, Recipe]
        }
       });

      const allpay = await Allpay.deleteById(id);
      const order = await RecipeOrder.deleteById(recipeOrder.RecipeOrderId);

      const message = 'Delete success.';
      res.ok({ message, data: { allpay, order } });
    } catch (e) {
      res.serverError(e);
    }
  },

  export: async (req, res) => {
    try {
      let { body, options } = req;
      let query = body;
      sails.log.info('export', query);
      const modelName = options.controller.split("/").reverse()[0];
      const include = {
        model: RecipeOrder,
        include: [User, Recipe]
      }
      const content = await ExportService.query({ query, modelName, include });
      const columns = {
        // id: "ID",
        // MerchantTradeNo: "訂單編號",
        // TradeNo: "金流交易編號",
        // PaymentDate: "付款時間",
        // PaymentTypeDesc: "付款方式",
        // invoiceNo: "發票號碼",
        // TradeAmt: "付款金額",
        vAccount: "付款帳號",
        ItemNameArray: "訂購物品",
        UserName: "訂購人",
        recipient: "收件人",
        authorName: "創作人",
        note: "備註",
        // RecipeId: "配方編號",
        scent0: '香味分子 1',
        // scentml0: '香味分子 1 滴數',
        scentPercent0: '香味分子 1 比例',
        scent1: '香味分子 2',
        // scentml1: '香味分子 2 滴數',
        scentPercent1: '香味分子 2 比例',
        scent2: '香味分子 3',
        // scentml2: '香味分子 3 滴數',
        scentPercent2: '香味分子 3 比例',
        scent3: '香味分子 4',
        // scentml3: '香味分子 4 滴數',
        scentPercent3: '香味分子 4 比例',
        scent4: '香味分子 5',
        // scentml4: '香味分子 5 滴數',
        scentPercent4: '香味分子 5 比例',
        scent5: '香味分子 6',
        // scentml5: '香味分子 6 滴數',
        scentPercent5: '香味分子 6 比例',
        // Email: "Email",
        Phone: "電話",
        Address: "住址",
        productionStatusDesc: "訂單狀態",
        RtnMsg: "交易訊息",
        createdAt: "訂單建立時間",
        scentList: '香味清單'
      }
      const format = (items) => {
        let result = [];
        for (let data of items) {
          if (data.PaymentType === 'aio') continue;
          let formatted = {
            id: data.id,
            TradeNo: data.TradeNo ? `="${data.TradeNo}"` : '',
            MerchantTradeNo: data.MerchantTradeNo,
            RtnMsg: data.RtnMsg,
            PaymentDate: data.PaymentDate == "Invalid date" ? '' : data.PaymentDate,
            PaymentTypeDesc: data.PaymentTypeDesc,
            invoiceNo: `="${data.invoiceNo || ''}"`,
            TradeAmt: `="${data.TradeAmt || ''}"`,
            vAccount: `="${data.vAccount || ''}"`,
            ItemNameArray: data.ItemNameArray,
            UserName: data.UserName,
            recipient: data.RecipeOrder.recipient,
            authorName: data.RecipeOrder.Recipe ? data.RecipeOrder.Recipe.authorName : '',
            RecipeId: data.RecipeOrder.RecipeId,
            productionStatusDesc: data.RecipeOrder.productionStatusDesc,
            note: data.Note,
            Email: data.Email,
            Phone: `="${data.Phone || ''}"`,
            Address: data.Address,
            createdAt: moment(new Date(data.createdAt)).format("YYYY/MM/DD HH:mm"),
          }
          if (data.RecipeOrder && data.RecipeOrder.Recipe) {
            formatted['scentList'] = '';
            data.RecipeOrder.Recipe.formula.forEach((formula, index) => {
              if (formula.scent && formula.drops > 0) {
                formatted[`scentList`] += `${formula.scent}:${formula.drops} `;
                formatted[`scent${index}`] = `${formula.scent}`,
                formatted[`scentml${index}`] = `${formula.drops}`,
                formatted[`scentPercent${index}`] = Math.ceil(formula.drops / data.RecipeOrder.Recipe.formulaTotalDrops * 10000)/10000;
              }
            });
          }
          result.push(formatted);
        };
        return result;
      }

      const result = await ExportService.export({
        fileName: '配方製作表',
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

  exportSend: async (req, res) => {
    try {
      let { body, options } = req;
      let query = body;
      sails.log.info('exportSend', query);
      const modelName = options.controller.split("/").reverse()[0];
      const include = {
        model: RecipeOrder,
        include: [User, Recipe]
      }
      const content = await ExportService.query({ query, modelName, include });
      const columns = {
        check: "check",
        PaymentTypeDesc: "付款方式",
        invoiceNo: "發票號碼",
        ItemNameArray: "訂購物品",
        UserName: "訂購人",
        recipient: "收件人",
        authorName: "創作人",
        note: "備註",
        Email: "Email",
        Phone: "電話",
        Address: "住址",
        createdAt: "訂單建立時間",
        scentList: '香味清單'
      }
      const format = (items) => {
        let result = [];
        for (let data of items) {
          if (data.PaymentType === 'aio') continue;
          let formatted = {
            check: '',
            PaymentTypeDesc: data.PaymentTypeDesc,
            invoiceNo: `="${data.invoiceNo || ''}"`,
            ItemNameArray: data.ItemNameArray,
            UserName: data.UserName,
            recipient: data.RecipeOrder.recipient,
            authorName: data.RecipeOrder.Recipe ? data.RecipeOrder.Recipe.authorName : '',
            note: data.Note,
            Email: data.Email,
            Phone: `="${data.Phone || ''}"`,
            Address: data.Address,
            createdAt: moment(new Date(data.createdAt)).format("YYYY/MM/DD HH:mm"),
          }
          if (data.RecipeOrder && data.RecipeOrder.Recipe) {
            formatted['scentList'] = '';
            data.RecipeOrder.Recipe.formula.forEach((formula, index) => {
              if (formula.scent && formula.drops > 0) {
                formatted[`scentList`] += `${formula.scent}:${formula.drops} `;
                // formatted[`scent${index}`] = `${formula.scent}`,
                // formatted[`scentml${index}`] = `${formula.drops}`,
                // formatted[`scentPercent${index}`] = Math.ceil(formula.drops / data.RecipeOrder.Recipe.formulaTotalDrops * 10000)/10000;
              }
            });
          }
          result.push(formatted);
        };
        return result;
      }

      const result = await ExportService.export({
        fileName: '地址寄送表',
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

  exportExcel: async (req, res) => {
    try {
      let { options, body } = req;
      let query = body;
      sails.log.info('export', query);
      const modelName = options.controller.split("/").reverse()[0];
      const include = {
        model: RecipeOrder,
        include: [User, Recipe]
      }
      const content = await ExportService.query({ query, modelName, include });
      const columns = [
        { caption: '付款帳號', type: 'string' },
        { caption: '訂購物品', type: 'string' },
        { caption: '訂購人', type: 'string' },
        { caption: '收件人', type: 'string' },
        { caption: '創作人', type: 'string' },
        { caption: '備註', type: 'string' },
        { caption: '香味分子 1', type: 'string' },
        { caption: '香味分子 1 比例', type: 'number' },
        { caption: '香味分子 2', type: 'string' },
        { caption: '香味分子 2 比例', type: 'number' },
        { caption: '香味分子 3', type: 'string' },
        { caption: '香味分子 3 比例', type: 'number' },
        { caption: '香味分子 4', type: 'string' },
        { caption: '香味分子 4 比例', type: 'number' },
        { caption: '香味分子 5', type: 'string' },
        { caption: '香味分子 5 比例', type: 'number' },
        { caption: '香味分子 6', type: 'string' },
        { caption: '香味分子 6 比例', type: 'number' },
        { caption: '電話', type: 'string' },
        { caption: '住址', type: 'string' },
        { caption: '訂單狀態', type: 'string' },
        { caption: '交易訊息', type: 'string' },
        { caption: '訂單建立時間', type: 'string' },
        { caption: '香味清單', type: 'string' }
      ];
      const format = (items) => {
        let result = [];
        for (let data of items) {
          if (data.PaymentType === 'aio') continue;
          let formatted = [
            `${data.vAccount || ''}`, //付款帳號
            data.ItemNameArray,          //訂購物品
            data.UserName,               //訂購人
            data.RecipeOrder.recipient,  //收件人
            data.RecipeOrder.Recipe ? data.RecipeOrder.Recipe.authorName : '', //創作人
            data.Note,                  //備註
          ];
          let scentList = '';           //香味清單
          if (data.RecipeOrder && data.RecipeOrder.Recipe) {
            for(let i = 0; i < 6; i++){
              if(!data.RecipeOrder.Recipe.formula[i] || !(data.RecipeOrder.Recipe.formula[i].scent && data.RecipeOrder.Recipe.formula[i].drops > 0) ){
                formatted.push( '', '');
              } else {
                scentList += `${data.RecipeOrder.Recipe.formula[i].scent}: ${data.RecipeOrder.Recipe.formula[i].drops} `;
                formatted.push(data.RecipeOrder.Recipe.formula[i].scent);
                formatted.push(Math.ceil( Number(data.RecipeOrder.Recipe.formula[i].drops) / Number(data.RecipeOrder.Recipe.formulaTotalDrops) * 10000)/10000);
              }
            }
          }
          formatted.push(
            `${data.Phone || ''}`,  //電話
            data.Address,              //住址
            data.RecipeOrder.productionStatusDesc,  //訂單狀態
            data.RtnMsg,              //交易訊息
            moment(new Date(data.createdAt)).format("YYYY/MM/DD HH:mm"), //訂單建立時間
            scentList                 //香味清單
          );

          result.push(formatted);
        };
        return result;
      }

      const result = await ExportService.exportExcel({
        fileName: '配方製作表',
        content,
        format,
        columns,
      });
      res.ok({
        message: 'Get Excel export success.',
        data: result.fileName,
      })
    } catch (e) {
      res.serverError(e);
    }
  },

  exportSendExcel: async (req, res) => {
    try {
      let { options, body } = req;
      let query = body;
      sails.log.info('exportSend', query);
      const modelName = options.controller.split("/").reverse()[0];
      const include = {
        model: RecipeOrder,
        include: [User, Recipe]
      }
      const content = await ExportService.query({ query, modelName, include });
      const columns = [
        { caption: "check", type: "string"},
        { caption: "付款方式", type: "string"},
        { caption: "發票號碼", type: "string"},
        { caption: "訂單編號", type: "string"},
        { caption: "訂購物品", type: "string"},
        { caption: "訂購人", type: "string"},
        { caption: "收件人", type: "string"},
        { caption: "創作人", type: "string"},
        { caption: "備註", type: "string"},
        { caption: "Email", type: "string"},
        { caption: "電話", type: "string"},
        { caption: "住址", type: "string"},
        { caption: "訂單建立時間", type: "string"},
        { caption: '香味清單', type: "string"},
        { caption: 'URL', type: "string"}
      ]
      const format = (items) => {
        let result = [];
        for (let data of items) {
          if (data.PaymentType === 'aio') continue;
          let formatted = [
            '',
            data.PaymentTypeDesc,
            `${data.invoiceNo || ''}`,
            data.MerchantTradeNo,
            data.ItemNameArray,
            data.UserName,
            data.RecipeOrder.recipient,
            data.RecipeOrder.Recipe ? data.RecipeOrder.Recipe.authorName : '',
            data.Note,
            data.Email,
            `${data.Phone || ''}`,
            data.Address,
            moment(new Date(data.createdAt)).format("YYYY/MM/DD HH:mm"),
          ]

          let scentList = '';
          if (data.RecipeOrder && data.RecipeOrder.Recipe) {
            data.RecipeOrder.Recipe.formula.forEach((formula, index) => {
              if (formula.scent && formula.drops > 0) {
                scentList += `${formula.scent}:${formula.drops} `;
              }
            });
          }
          formatted.push(scentList);
          formatted.push(`http://labfnp.com/recipe/${data.RecipeOrder.Recipe ? data.RecipeOrder.Recipe.hashId : ''}`);

          result.push(formatted);
        };
        return result;
      }

      const result = await ExportService.exportExcel({
        fileName: '地址寄送表',
        content,
        format,
        columns,
      });
      res.ok({
        message: 'Get Excel export success.',
        data: result.fileName,
      })
    } catch (e) {
      res.serverError(e);
    }
  },

  importTrackingNumberExcel: async (req, res) => {
    try {
      sails.log.info(req.body)
      let uploadParam = {
        dirname: '../../.tmp/'
      };
      let promise = new Promise((resolve, reject) => {
        req.file('upload').upload(uploadParam, async(err, files) => {
          resolve(files);
        });
      });
      let files = await promise.then();
      const { size, type, fd, extra } = files[0];
      res.ok({
        message: 'Get Excel export success.',
        data: fd.split('.tmp/').pop(),
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  updateTrackingNumberfromExcel: async (req, res) => {
    try {
      const { body } = req;
      sails.log.info(body);

      const columns = [{
        name: 'merchantTradeNo',
        index: 2,
      }, {
        name: 'trackingNumber',
        index: 3,
      }]

      const result = await ExportService.parseExcel({
        fileName: body.fileName,
        startIndex: 1,
        sheetIndex: 0,
        columns,
      });
      sails.log.info("匯入貨運表", result);
      let notFound = [];
      let updateError = [];
      for (let data of result) {
        let allpay = await Allpay.findOne({
          where: {
            MerchantTradeNo: data.merchantTradeNo
          },
        });
        if (allpay) {
          let recipeOrder = await RecipeOrder.update({
            trackingNumber: data.trackingNumber,
            productionStatus: 'SHIPPED',
          }, {
            where: {
              id : allpay.RecipeOrderId,
            },
          });
          if (recipeOrder[0] !== 1) {
            updateError.push(data.merchantTradeNo);
          }
        } else {
          notFound.push(data.merchantTradeNo);
        }
      }

      res.ok({
        message: 'update trackingNumber',
        data: {
          updateError,
          notFound,
        },
      })
    } catch (e) {
      res.serverError(e);
    }
  }

}
