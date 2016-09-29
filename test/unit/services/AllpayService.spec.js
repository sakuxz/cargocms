
describe.skip('about Allpay service', () => {
  let allpay;
  let recipe;
  before(async(done) => {
    try {
      recipe = await Recipe.create({
        formula:[
          {"drops":"1","scent":"BA69","color":"#E87728"},
          {"drops":"2","scent":"BA70","color":"#B35721"}
        ],
        formulaLogs: '',
        authorName: '王大明',
        perfumeName: 'love',
        description: 'this is love',
        message: '備註',
      });
      allpay = await Allpay.create({
        MerchantTradeNo: '2000132816da8db1',
        RecipeId: recipe.id,
        ShouldTradeAmt: 22000
      });
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });

  it('generator checkValue and return config', (done) => {
    try {
      const data = { MerchantID: '2000132',
        MerchantTradeNo: '200013244f273b61',
        MerchantTradeDate: '2016/03/02 14:18:22',
        PaymentType: 'aio',
        TotalAmount: 310,
        TradeDesc: 'Allpay push order test',
        ItemName: '月圓人團圓好吃柚子(圓滿柚)X1',
        ReturnURL: 'http://localhost:1337/allpay/paid',
        ChoosePayment: 'Credit',
        ClientBackURL: 'http://localhost:1337/shop/done?t=200013244f273b61',
        PaymentInfoURL: 'http://localhost:1337/allpay/paymentinfo',
      };
      const genData = AllpayService.genCheckMacValue(data);
      genData.CheckMacValue.should.be.an.equal('A5C94058EB3AB5E11319F92F0D3D725B');
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });


  describe('first create allpay order use getAllpayConfig() generator allpay Config ', () => {

    it('paymentMethod is ATM', async(done) => {
      try {
        const data = {
          relatedKeyValue: {
            RecipeId: recipe.id,
          },
          MerchantTradeNo: '123',
          tradeDesc: 'test gen config',
          totalAmount: 999,
          paymentMethod: 'ATM',
          itemArray: ['Item01', 'Item02'],
        }
        const result = await AllpayService.getAllpayConfig(data);
        console.log(result);
        result.MerchantTradeNo.should.be.an.equal(data.MerchantTradeNo);
        result.ChoosePayment.should.be.an.equal(data.paymentMethod);
        done();
      } catch (e) {
        console.log(e);
        done(e);
      }
    });

    it('paymentMethod is All', async (done) => {
      try {
        const data = {
          relatedKeyValue: {
            RecipeId: recipe.id,
          },
          MerchantTradeNo: '123123',
          tradeDesc: 'test gen config',
          totalAmount: 999,
        };
        const result = await AllpayService.getAllpayConfig(data);
        console.log(result);
        result.MerchantTradeNo.should.be.an.equal(data.MerchantTradeNo);
        result.ChoosePayment.should.be.an.equal('ALL');
        done();
      } catch (e) {
        console.log(e);
        done(e);
      }
    });
  });

  describe('second if allpay order create success allpay will callback data , use paymentinfo() handle', () => {

    before(async(done) => {
      try {
        await Allpay.create({
          MerchantTradeNo: 'sdkfsldfjkl23s',
          RecipeId: recipe.id,
          ShouldTradeAmt: 22000
        });

        await Allpay.create({
          MerchantTradeNo: 'cavAsdasdasdasd',
          RecipeId: recipe.id,
          ShouldTradeAmt: 22000
        });
        done();
      } catch (e) {
        console.log(e);
        done(e);
      }
    });

    it('paymentMethod is ATM', async (done) => {
      try {
        const data = {
          MerchantID: '123456789',
          MerchantTradeNo: 'sdkfsldfjkl23s',
          RtnCode: '2',
          RtnMsg: 'Get VirtualAccount Succeeded',
          TradeNo: 'sdkfsldfjkl23',
          TradeAmt: 22000,
          PaymentType: 'ATM_TAISHIN',
          TradeDate: '2012/03/15 17:40:58',
          CheckMacValue: '18196F5D22DB1D0E2B4858C2B1719F40',
          BankCode: '812',
          vAccount: '9103522175887271',
          ExpireDate: '2013/12/16',
        };
        const result = await AllpayService.paymentinfo(data);
        result.dataValues.MerchantTradeNo.should.be.an.equal(data.MerchantTradeNo);
        result.dataValues.RtnCode.should.be.an.equal(data.RtnCode);
        result.dataValues.ShouldTradeAmt.should.be.an.equal(data.TradeAmt);
        result.dataValues.PaymentType.should.be.an.equal(data.PaymentType);
        result.dataValues.BankCode.should.be.an.equal(data.BankCode);
        result.dataValues.vAccount.should.be.an.equal(data.vAccount);
        result.dataValues.ExpireDate.should.be.an.equal(data.ExpireDate);
        done();
      } catch (e) {
        done(e);
      }
    });

    it('paymentMethod is BARCODE', async (done) => {
      try {
        const data = {
          MerchantID: '123456789',
          MerchantTradeNo: 'cavAsdasdasdasd',
          RtnCode: '2',
          RtnMsg: 'Get VirtualAccount Succeeded',
          TradeNo: 'cavAsdasdasdasd',
          TradeAmt: 22000,
          PaymentType: 'ATM_TAISHIN',
          TradeDate: '2012/03/15 17:40:58',
          CheckMacValue: '98AA8486E3D4CC3B80C6795C16CB74FB',
          PaymentNo: 'GW130412257496',
          ExpireDate: '2013/12/16 18:00:00',
          Barcode1: '021030627',
          Barcode2: '2470200001841540',
          Barcode3: '103027000000100',
        };
        const result = await AllpayService.paymentinfo(data);
        result.dataValues.MerchantTradeNo.should.be.an.equal(data.MerchantTradeNo);
        result.dataValues.RtnCode.should.be.an.equal(data.RtnCode);
        result.dataValues.ShouldTradeAmt.should.be.an.equal(data.TradeAmt);
        result.dataValues.PaymentType.should.be.an.equal(data.PaymentType);
        result.dataValues.PaymentNo.should.be.an.equal(data.PaymentNo);
        result.dataValues.ExpireDate.should.be.an.equal(data.ExpireDate);
        result.dataValues.Barcode1.should.be.an.equal(data.Barcode1);
        result.dataValues.Barcode2.should.be.an.equal(data.Barcode2);
        result.dataValues.Barcode2.should.be.an.equal(data.Barcode2);
        done();
      } catch (e) {
        done(e);
      }
    });
  });


  it('third user payment completed allpay will callback data , use paid() handle', async(done) => {
    try {
      const data = {
        MerchantID: '123456789',
        MerchantTradeNo: '2000132816da8db1',
        RtnCode: '1',
        RtnMsg: 'paid',
        TradeNo: '201203151740582564',
        TradeAmt: 22000,
        PaymentDate: '2012/03/16 12:03:12',
        PaymentType: 'ATM_TAISHIN',
        PaymentTypeChargeFee: 25,
        TradeDate: '2012/03/15 17:40:58',
        SimulatePaid: 0,
        CheckMacValue: 'FD79C15859F58D0BC24CDE67F59CC81C',
      };
      const result = await AllpayService.paid(data);
      result.dataValues.MerchantTradeNo.should.be.an.equal(data.MerchantTradeNo);
      result.dataValues.RtnCode.should.be.an.equal(data.RtnCode);
      result.dataValues.RtnMsg.should.be.an.equal(data.RtnMsg);
      result.dataValues.TradeAmt.should.be.an.equal(data.TradeAmt);
      done();
    } catch (e) {
      done(e);
    }
  });
});
