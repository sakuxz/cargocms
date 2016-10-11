
describe("about Mailer service", () => {
  let order = {
    serialNumber: 'test',
    User: {
      username: 'testUser',
      email: 'smlsun@gmail.com'
    }
  }

  it('send paymentConfirm', async (done) => {

    try {
      let messageConfig = await MessageService.paymentConfirm({
        email: '123@gmail.com',
        serialNumber: '123456787893f',
        username: 'BBBB',
      });
      let message = await Message.create(messageConfig);
      await MessageService.sendMail(message);
      done();
    } catch (e) {
      done(e);
    }

  });

  it('send orderConfirm', async (done) => {

    try {
      let messageConfig = await MessageService.orderConfirm({
        productName: 'productName!!!!',
        serialNumber: 'serialNumber!!!!',
        email: 'email!!!!',
        phone: 'phone!!!!!',
        username: 'username!!!!',
        bankId: 'bankId!!!!',
        bankName: 'bankName!!!!',
        bankName: 'bankName!!!!',
        accountId: 'accountId!!!!',
        accountName: 'accountName!!!!',
        paymentTotalAmount: 'paymentTotalAmount!!!!',
        shipmentUsername: 'shipmentUsername!!!!',
        shipmentAddress: 'shipmentAddress!!!!',
        expireDate: '2016/09/13',
        note: 'note!!!!!!!',
        invoiceNo: 'invoiceNo!!!'
      });
      let message = await Message.create(messageConfig);
      await MessageService.sendMail(message);
      done();
    } catch (e) {
      done(e);
    }

  });

  it('send deliveryConfirm', async (done) => {

    try {
      await MessageService.deliveryConfirm(order);
      done();
    } catch (e) {
      done(e);
    }

  });

  it('send forgotPassword', async (done) => {

    try {
      let messageConfig = await MessageService.forgotPassword({
        email: 'user@gmail.com',
        api: '/update/password?token=AAAA',
        username: 'Allen',
      });
      let message = await Message.create(messageConfig);
      await MessageService.sendMail(message);
      done();
    } catch (e) {
      done(e);
    }

  });

  it('send eventOrderConfirm', async (done) => {

    try {
      let messageConfig = await MessageService.eventOrderConfirm({
        productName: 'productName!!!!',
        serialNumber: 'serialNumber!!!!',
        email: 'email!!!!',
        phone: 'phone!!!!!',
        username: 'username!!!!',
        bankId: 'bankId!!!!',
        bankName: 'bankName!!!!',
        bankName: 'bankName!!!!',
        accountId: 'accountId!!!!',
        accountName: 'accountName!!!!',
        paymentTotalAmount: 'paymentTotalAmount!!!!',
        shipmentUsername: 'shipmentUsername!!!!',
        shipmentAddress: 'shipmentAddress!!!!',
        expireDate: '2016/09/13',
        note: 'note!!!!!!!',
      });
      let message = await Message.create(messageConfig);
      await MessageService.sendMail(message);
      done();
    } catch (e) {
      done(e);
    }

  });

});
