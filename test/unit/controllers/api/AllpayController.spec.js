
describe('about Allpay controllers', () => {

  describe('second if allpay order create success allpay will callback data , use paymentinfo() handle', () => {

    const serialize = (obj, prefix) => {
      let str = [];
      for(let p in obj) {
        if (obj.hasOwnProperty(p)) {
          let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
          str.push(typeof v == "object" ?
            serialize(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
      }
      return str.join("&");
    }

    let recipe;
    before(async(done) => {
      try {
        const user = await User.create({
          username: 'testAllpay',
          email: 'testAllpay@example.com',
          firstName: '大明', 
          lastName: '王'
        })
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
        const recipeOrder = await RecipeOrder.create({
          recipient: 'AAA',
          address: 'Taiwan',
          phone: '0953999999',
          email: 'da@gmail.com',
          note: '456',
          remark: '456',
          UserId: user.id,
          RecipeId: recipe.id,
        });
        await Allpay.create({
          MerchantTradeNo: 'sdkfsldfjkl23123s',
          RecipeOrderId: recipeOrder.id,
          ShouldTradeAmt: 22000
        });

        await Allpay.create({
          MerchantTradeNo: 'cavAsqwexc',
          RecipeOrderId: recipeOrder.id,
          ShouldTradeAmt: 22000
        });

        await Allpay.create({
          MerchantTradeNo: '2000132816da8db1',
          RecipeOrderId: recipeOrder.id,
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
          MerchantTradeNo: 'sdkfsldfjkl23123s',
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
        const res = await request(sails.hooks.http.app)
        .post(`/api/allpay/paymentinfo`).send(data);
        console.log(res.text);
        res.text.should.be.eq('1|OK');
        done();
      } catch (e) {
        done(e);
      }
    });

    it('paymentMethod is BARCODE', async (done) => {
      try {
        const data = {
          MerchantID: '123456789',
          MerchantTradeNo: 'cavAsqwexc',
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
        sails.log.debug(result.toJSON());
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

    it('third user payment completed allpay will callback data , use paid contr handle', async(done) => {
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
        const res = await request(sails.hooks.http.app)
        .post(`/api/allpay/paid`).send(data);
        res.text.should.be.eq('1|OK');
        done();
      } catch (e) {
        done(e);
      }
    });

    it('export csv', async (done) => {
      try {
        const webForm = {
          "draw": 1,
          "columns": [{
            "data": "id",
            "name": "",
            "searchable": true,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "MerchantTradeNo",
            "name": "",
            "searchable": false,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "RtnMsg",
            "name": "",
            "searchable": true,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "PaymentTypeDesc",
            "name": "",
            "searchable": false,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "invoiceNo",
            "name": "",
            "searchable": false,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "TradeAmt",
            "name": "",
            "searchable": true,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "vAccount",
            "name": "",
            "searchable": true,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "ItemNameArray",
            "name": "",
            "searchable": false,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "UserName",
            "name": "",
            "searchable": false,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "Email",
            "name": "",
            "searchable": false,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "Phone",
            "name": "",
            "searchable": false,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "Address",
            "name": "",
            "searchable": false,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }, {
            "data": "createdAt",
            "name": "",
            "searchable": true,
            "orderable": true,
            "search": {
              "value": "",
              "regex": false
            }
          }],
          "order": [{
            "column": 0,
            "dir": "asc"
          }],
          "start": 0,
          "length": 10,
          "search": {
            "value": "",
            "regex": false
          },
          "startDate": "1990/1/1",
          "endDate": "3000/1/1",
        };
        const res = await request(sails.hooks.http.app)
        .get(`/api/admin/allpay/export`).query(serialize(webForm));
        res.status.should.be.eq(200);
        console.log(res.text);
        done();
      } catch (e) {
        done(e);
      }
    });

  });

});
