import moment from 'moment';

module.exports = {
  attributes: {
    // 歐付寶
    // 欄位名稱統一使用歐付寶回傳資料，所以不符合其他命名規則
    // 訂單編號，提供給 allpay 使用
    // 訂單成立後更新的編號，由 allpay 提供
    TradeNo: {
      type: Sequelize.STRING(20),
      unique: true,
    },
    MerchantTradeNo: {
      type: Sequelize.STRING(20),
      unique: true,
    },
    // allpay 回傳資訊
    RtnCode: {
      type: Sequelize.INTEGER(2),
    },
    // allpay 回傳資訊
    RtnMsg: {
      type: Sequelize.STRING(200),
    },
    // allpay 付款時間
    PaymentDate: {
      type: Sequelize.DATE,
      get: function () {
        try {
          let PaymentDate = this.getDataValue('PaymentDate');
          if (PaymentDate) {
            return moment(new Date(PaymentDate)).format("YYYY/MM/DD HH:mm:SS");
          } else {
            return '';
          }
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    // allpay 交易日期
    TradeDate: {
      type: Sequelize.DATE,
    },
    // allpay 採用金流方式
    PaymentType: {
      type: Sequelize.STRING(20),
    },
    // allpay 應該要收到的付款金額
    ShouldTradeAmt: {
      type: Sequelize.FLOAT,
    },
    // allpay 付款金額
    TradeAmt: {
      type: Sequelize.FLOAT,
    },
    // allpay bankcode
    BankCode: {
      type: Sequelize.STRING(3),
    },
    // 要繳費的帳號
    vAccount: {
      type: Sequelize.STRING(16),
    },
    // 過期日期
    ExpireDate: {
      type: Sequelize.STRING(20),
      get: function () {
        try {
          let ExpireDate = this.getDataValue('ExpireDate');
          if (ExpireDate) {
            return moment(new Date(ExpireDate)).format("YYYY/MM/DD 23:59:59");
          } else {
            return '';
          }
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    // 支付交易編號
    PaymentNo: {
      type: Sequelize.STRING(14),
    },
    // allpay 交易，用於 ibon, barcode 付帳流程上
    Barcode1: {
      type: Sequelize.STRING(20),
    },
    Barcode2: {
      type: Sequelize.STRING(20),
    },
    Barcode3: {
      type: Sequelize.STRING(20),
    },
    // allpay 金額產生使用
    CheckMacValue: {
      type: Sequelize.STRING,
    },
    // 訂單產生的時候的交易時間
    MerchantTradeDate: {
      type: Sequelize.DATE,
    },

    Recipient: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let recipient = '';
          if(order){
            recipient = order.recipient;
          }
          return recipient;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    Address: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let address = '';
          if(order){
            address = order.address;
          }
          return address;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    Phone: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let phone = '';
          if(order){
            phone = order.phone;
          }
          return phone;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    Email: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let email = '';
          if(order){
            email = order.email;
          }
          return email;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    Note: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let note = '';
          if(order){
            note = order.note;
          }
          return note;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    Remark: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let remark = '';
          if(order){
            remark = order.remark;
          }
          return remark;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    invoiceNo: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let invoiceNo = '';
          if(order){
            invoiceNo = order.invoiceNo;
          }
          return invoiceNo;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    ItemNameArray: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let ItemNameArray = '';
          if(order && order.ItemNameArray){
            ItemNameArray = order.ItemNameArray.join(',');
          }
          return ItemNameArray;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    UserName: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let userName = '';
          if(order){
            if(order.User){
               userName = order.User.displayName;
            }
          }
          return userName;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    shipping: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let shipping = '';
          if(order && order.shipping){
            shipping = order.shipping;
          }
          return shipping;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    shippingDesc: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let shippingDesc = '';
          if(order && order.shipping ){
            shippingDesc = sails.__({
              phrase: order.shipping,
              locale: 'zh'
            });
          }
          return shippingDesc;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
    trackingNumber: {
      type: Sequelize.VIRTUAL,
      get: function() {
        try {
          const order = this.getDataValue('RecipeOrder') || this.getDataValue('EventOrder');
          let trackingNumber = '';
          if(order && order.trackingNumber){
            trackingNumber = order.trackingNumber;
          }
          return trackingNumber;
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    PaymentTypeDesc:{
      type: Sequelize.VIRTUAL,
      get: function() {
        try{
          const payDesc = this.getDataValue('PaymentType');
          let PaymentTypeDesc = sails.__({
            phrase: payDesc,
            locale: 'zh'
          });

          return PaymentTypeDesc;
        }
        catch(e){
          sails.log.error(e);
        }
      }
    },

    createdDateTime:{
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('createdAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    },

    updatedDateTime:{
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('updatedAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    }

  },
  associations: function() {
  },
  options: {
    paranoid: true,
    classMethods: {
      deleteById: async (id) => {
        try {
          return await Allpay.destroy({ where: { id } });
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },
    instanceMethods: {},
    hooks: {}
  }
};
