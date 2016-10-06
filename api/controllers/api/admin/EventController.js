import crypto from 'crypto';
import moment from 'moment';
import allPayPaymentTypeJson from '../../../../config/allpayPaymentType.json';


module.exports = {
  paid: async (req, res) => {
    try {
      const data = req.body;
      sails.log.info(data);
      const allpay = await AllpayService.paid(data);

      //  create and send message
      let messageConfig = {};
      messageConfig.serialNumber = allpay.TradeNo;
      if (allpay.EventOrderId) {
        const eventOrder = await EventOrder.findOne({
          where: allpay.EventOrderId,
          include: [User, Event]
        });
        eventOrder.productionStatus = 'PAID';
        await eventOrder.save();
        messageConfig.email = eventOrder.email;
        messageConfig.username = eventOrder.User.displayName;
      }
      // messageConfig = await MessageService.paymentConfirm(messageConfig);
      // const message = await Message.create(messageConfig);
      // await MessageService.sendMail(message);

      res.send('1|OK');
    } catch (e) {
      res.serverError(e);
    }
  },

  paymentinfo: async(req, res) => {
    try {
      const data = req.body;
      sails.log.info(data);
      const allpay = await AllpayService.paymentinfo(data);

      let messageConfig = {};
      messageConfig.serialNumber = allpay.TradeNo;
      messageConfig.paymentTotalAmount = allpay.ShouldTradeAmt;
      messageConfig.bankName = allPayPaymentTypeJson[allpay.PaymentType] || allpay.PaymentType;
      messageConfig.bankId = allpay.BankCode;
      messageConfig.accountId = allpay.vAccount;
      messageConfig.expireDate = allpay.ExpireDate;
      if (allpay.EventOrderId) {
        const eventOrder = await EventOrder.findOne({
          where: allpay.EventOrderId,
          include: [User, Event]
        });
        messageConfig.productName = eventOrder.Event.title + ' 1 張';
        messageConfig.email = eventOrder.email;
        messageConfig.username = eventOrder.User.displayName;
        messageConfig.shipmentUsername = eventOrder.recipient;
        messageConfig.shipmentAddress = eventOrder.address;
        messageConfig.note = eventOrder.note;
        messageConfig.phone = eventOrder.phone;
      }

      // messageConfig = await MessageService.orderConfirm(messageConfig);
      // const message = await Message.create(messageConfig);
      // await MessageService.sendMail(message);

      res.send('1|OK');
    } catch (e) {
      res.serverError(e);
    }
  },

  export: async (req, res) => {
    try {
      let { query, options } = req;
      sails.log.info('export', query);
      const modelName = options.controller.split("/").reverse()[0];
      const content = await ExportService.query({ query, modelName });
      const columns = {}
      const format = (items) => {
        return items;
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
