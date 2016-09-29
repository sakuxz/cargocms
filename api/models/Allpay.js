import moment from 'moment';
import allPayPaymentTypeJson from '../../config/allpayPaymentType.json';

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
          return moment(this.getDataValue('PaymentDate')).format("YYYY/MM/DD HH:mm:SS");
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
          const recipeOrder = this.getDataValue('RecipeOrder');
          let recipient = '';
          if(recipeOrder){
            recipient = recipeOrder.recipient;
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
          const recipeOrder = this.getDataValue('RecipeOrder');
          let address = '';
          if(recipeOrder){
            address = recipeOrder.address;
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
          const recipeOrder = this.getDataValue('RecipeOrder');
          let phone = '';
          if(recipeOrder){
            phone = recipeOrder.phone;
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
          const recipeOrder = this.getDataValue('RecipeOrder');
          let email = '';
          if(recipeOrder){
            email = recipeOrder.email;
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
          const recipeOrder = this.getDataValue('RecipeOrder');
          let note = '';
          if(recipeOrder){
            note = recipeOrder.note;
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
          const recipeOrder = this.getDataValue('RecipeOrder');
          let remark = '';
          if(recipeOrder){
            remark = recipeOrder.remark;
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
          const recipeOrder = this.getDataValue('RecipeOrder');
          let invoiceNo = '';
          if(recipeOrder){
            invoiceNo = recipeOrder.invoiceNo;
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
          const recipeOrder = this.getDataValue('RecipeOrder');
          let ItemNameArray = '';
          if(recipeOrder){
            ItemNameArray = recipeOrder.ItemNameArray.join(',');
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
          const recipeOrder = this.getDataValue('RecipeOrder');
          let userName = '';
          if(recipeOrder){
            if(recipeOrder.User){
               userName = recipeOrder.User.displayName;
            }
          }
          return userName;
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
          let PaymentTypeDesc = allPayPaymentTypeJson[payDesc] || payDesc;

          return PaymentTypeDesc;
        }
        catch(e){
          sails.log.error(e);
        }
      }
    },

    createdAt: {
			type: Sequelize.DATE,
			get: function () {
				try {
					return moment(this.getDataValue('createdAt')).format("YYYY/MM/DD HH:mm");
				} catch (e) {
					sails.log.error(e);
				}
			}
		},

  },
  associations: function() {
    Allpay.belongsTo(RecipeOrder);
  },
  options: {
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
