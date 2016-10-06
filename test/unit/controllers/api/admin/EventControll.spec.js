var sinon = require('sinon');
import crypto from 'crypto';

describe('about admin api event Controller operation.', function() {

  describe.only('about Event Allpay Controller operation.', function() {
    let event, allpay1, allpay2, allpay3;
    before(async(done) => {
      try {
        const user = await User.create({
          username: 'testEventAllpay',
          email: 'testEventAllpay@example.com',
          firstName: '大明',
          lastName: '王'
        })
        event = await Event.create({
    			"limit": 10,
    			"signupCount": 0,
    			"price": 1000,
    			"title": "測試 Event 1 號",
    			"description": null,
    			"sellStartDate": "1990-1-1",
    			"sellEndDate": "3000-1-1",
    			"eventStartDate": "1990-1-1",
    			"eventEndDate": "3000-1-1",
        });
        const eventOrder = await EventOrder.create({
          recipient: 'AAA',
          address: 'Taiwan',
          phone: '0953999999',
          email: 'da@gmail.com',
          note: '456',
          remark: '456',
          UserId: user.id,
          EventId: event.id,
        });
        allpay1 = await Allpay.create({
          MerchantTradeNo: crypto.randomBytes(32).toString('hex').substr(0, 8),
          EventOrderId: eventOrder.id,
          ShouldTradeAmt: 1000
        });

        allpay2 = await Allpay.create({
          MerchantTradeNo: crypto.randomBytes(32).toString('hex').substr(0, 8),
          EventOrderId: eventOrder.id,
          ShouldTradeAmt: 1000
        });

        allpay3 = await Allpay.create({
          MerchantTradeNo: crypto.randomBytes(32).toString('hex').substr(0, 8),
          EventOrderId: eventOrder.id,
          ShouldTradeAmt: 1000
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
          MerchantTradeNo: allpay1.MerchantTradeNo,
          RtnCode: '2',
          RtnMsg: 'Get VirtualAccount Succeeded',
          TradeNo: crypto.randomBytes(32).toString('hex').substr(0, 8),
          TradeAmt: 1000,
          PaymentType: 'ATM_TAISHIN',
          TradeDate: '2012/03/15 17:40:58',
          CheckMacValue: '18196F5D22DB1D0E2B4858C2B1719F40',
          BankCode: '812',
          vAccount: '9103522175887271',
          ExpireDate: '2013/12/16',
        };
        const res = await request(sails.hooks.http.app)
        .post(`/api/event/paymentinfo`).send(data);
        console.log(res.text);
        res.text.should.be.eq('1|OK');
        done();
      } catch (e) {
        done(e);
      }
    });

    it('third user payment completed allpay will callback data , use paid contr handle', async(done) => {
      try {
        const data = {
          MerchantID: '123456789',
          MerchantTradeNo: allpay1.MerchantTradeNo,
          RtnCode: '1',
          RtnMsg: 'paid',
          TradeNo: crypto.randomBytes(32).toString('hex').substr(0, 8),
          TradeAmt: 1000,
          PaymentDate: '2012/03/16 12:03:12',
          PaymentType: 'ATM_TAISHIN',
          PaymentTypeChargeFee: 25,
          TradeDate: '2012/03/15 17:40:58',
          SimulatePaid: 0,
          CheckMacValue: 'FD79C15859F58D0BC24CDE67F59CC81C',
        };
        const res = await request(sails.hooks.http.app)
        .post(`/api/event/paid`).send(data);
        res.text.should.be.eq('1|OK');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

});
