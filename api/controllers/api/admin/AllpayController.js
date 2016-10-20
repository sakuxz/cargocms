import moment from 'moment';

module.exports = {

  find: async (req, res) => {
    try {
      const { query } = req;
      const { serverSidePaging } = query;
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
      let { query, options } = req;
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
      let { query, options } = req;
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
        // let result = items.map((data) => {
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
}
