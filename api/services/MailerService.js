import MailerService from 'sails-service-mailer';
module.exports = MailerService(sails.config.mail.type, sails.config.mail.config);
