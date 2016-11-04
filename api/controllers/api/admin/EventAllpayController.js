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
          include: [User, Event]
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
        include:{
          model: EventOrder,
          include: [User, Event]
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
}
