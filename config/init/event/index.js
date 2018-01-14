import crypto from 'crypto';

module.exports.init = async () => {
  try {
    const isDevMode = sails.config.environment === 'development';
    const isDropMode = sails.config.models.migrate == 'drop';

    if (isDevMode && isDropMode) {
      let event, allpay1;
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
    }
  } catch (e) {
    console.error(e);
  }
};
