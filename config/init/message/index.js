module.exports.init = async () => {
  try {
    // == Message ==
    let order = {
      serialNumber: 'test',
      User: {
        username: 'testUser',
        email: 'smlsun@gmail.com'
      }
    }
    let messageConfig = await MessageService.paymentConfirm(order);
    let message = await Message.create(messageConfig);
    await MessageService.sendMail(message);
    // == Message done. ==
  } catch (e) {
    console.error(e);
  }
};
