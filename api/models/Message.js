

module.exports = {
  attributes: {
    sendBy: Sequelize.ENUM(
      'email',
      'sms'
    ),
    type: Sequelize.ENUM(
      'greeting',
      'orderConfirm',
      'paymentConfirm',
      'deliveryConfirm',
      'orderSync',
      'forgotPassword'
    ),
    from: Sequelize.STRING,
    to: Sequelize.STRING,
    subject: Sequelize.STRING,
    text: Sequelize.TEXT,
    html: Sequelize.TEXT,
    success: Sequelize.BOOLEAN,
    error: Sequelize.STRING
  },
  associations: () => {
  },
  options: {
    classMethods: {
      deleteById: async (id) => {
        try {
          return await Message.destroy({ where: { id } });
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      }
    },
    instanceMethods: {},
    hooks: {}
  }
};
