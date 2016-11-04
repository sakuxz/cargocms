module.exports = {

  find: async (req, res) => {
    try {
      const { serverSidePaging } = req.query;
      const query = req.body;
      const modelName = 'allpay'
      let result;
      if (serverSidePaging) {
        const include = {
          model: EventOrder,
          include: [
            User,
            {
              model: Event,
              // include: [ Post ]
            }
          ]
        }
        result = await PagingService.process({ query, modelName, include });
      } else {
        const items = await sails.models[modelName].findAll({
          include:{
            model: EventOrder,
            include: [User, Event]
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
        include:[ {
          model: EventOrder,
          include: [
            User,
            {
              model: Event,
              // include: [ Post ]
            }
          ]
        } ]
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
      //allpay , EventOrder 分拆更新資料
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
      const eventData = {
        recipient: data.Recipient,
        address: data.Address,
        phone: data.Phone,
        email: data.Email,
        note: data.Note,
        remark: data.Remark,
        productionStatus: data.EventOrder.productionStatus
      };

      // const allpay = await Allpay.update(allpayData ,{
      //   where: { id, },
      // });

      const order = await EventOrder.update(eventData, {
        where: { id: data.EventOrderId, },
      });

      res.ok({ message, data: { order } });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const eventOrder = await Allpay.findOne({
        where:{
          id
        },
        include:{
          model: EventOrder,
          include: [User, Event]
        }
       });

      const allpay = await Allpay.deleteById(id);
      const order = await EventOrder.deleteById(eventOrder.EventOrderId);

      const message = 'Delete success.';
      res.ok({ message, data: { allpay, order } });
    } catch (e) {
      res.serverError(e);
    }
  },
  exportExcel: async (req, res) => {
    try {
      let { query, options } = req;
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
      res.attachment(result.fileName);
      res.end(result.data, 'UTF-8');
    } catch (e) {
      res.serverError(e);
    }
  },

  exportSignExcel: async (req, res) => {
    try {
      let { query, options } = req;
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
        { caption: "訂購物品", type: "string"},
        { caption: "訂購人", type: "string"},
        { caption: "收件人", type: "string"},
        { caption: "創作人", type: "string"},
        { caption: "備註", type: "string"},
        { caption: "Email", type: "string"},
        { caption: "電話", type: "string"},
        { caption: "住址", type: "string"},
        { caption: "訂單建立時間", type: "string"},
        { caption: '香味清單', type: "string"}
      ]
      const format = (items) => {
        let result = [];
        for (let data of items) {
          if (data.PaymentType === 'aio') continue;
          let formatted = [
            '',
            data.PaymentTypeDesc,
            `${data.invoiceNo || ''}`,
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
      res.attachment(result.fileName);
      res.end(result.data, 'UTF-8');
    } catch (e) {
      res.serverError(e);
    }
  },
}
