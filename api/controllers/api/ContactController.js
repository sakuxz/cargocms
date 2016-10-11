import axios from 'axios';

module.exports = {
  create: async (req, res) => {
    try {
      const { name, email, phone, subject, content } = req.body;


      const secret = sails.config.reCAPTCHA.secret;
      const response = req.body['g-recaptcha-response'];
      const recaptcha = await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`);
      if (!recaptcha.data.success) throw Error('請稍候再試');

      await Contact.create({ name, email, phone, subject, content, success: true });

      let messageConfig = {name, email, phone, subject, content, success: true};
      messageConfig = await MessageService.contactConfirm(messageConfig);
      let message = await Message.create(messageConfig);
      await MessageService.sendMail(message);

      messageConfig = {name, email, phone, subject, content, success: true};
      messageConfig = await MessageService.contactSendToAdmin(messageConfig);
      message = await Message.create(messageConfig);
      await MessageService.sendMail(message);

      req.flash('info', '訊息傳送成功');
      res.ok({
        message:`create contact success. send email`,
        data: {},
      }, {
        redirect: '/contact',
      });
    } catch (e) {
      req.flash('error', e.message);
      res.serverError(e, { redirect: '/contact'});
    }
  },

}
