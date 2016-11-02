import moment from 'moment';

module.exports = {
	attributes: {
		recipient: {
			type: Sequelize.STRING,
		},
		address: {
			type: Sequelize.STRING,
		},
		phone: {
			type: Sequelize.STRING,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: true
		},
		note: {
			type: Sequelize.STRING,
			allowNull: true
		},
		remark: {
			type: Sequelize.STRING,
		},
    invoiceNo: {
      type: Sequelize.STRING,
    },

		productionStatus: {
      type: Sequelize.ENUM("NEW", "RECEIVED", "REQUESTED", "SUBMITTED", "PAID", "PROCESSING", "CANCELLED", "SHIPPED", "DELIVERED", "COMPLETED"),
      defaultValue: 'NEW',
    },
		
		token: {
      type: Sequelize.STRING(32),
			unique: true,
    },

    productionStatusDesc: {
      type: Sequelize.VIRTUAL,
      get: function() {
        let desc = '';
        switch (this.productionStatus) {
          case 'NEW':
            desc = 'NEW';
            break;
          case 'SUBMITTED':
            desc = '下訂單';
            break;
          case 'PAID':
            desc = '已付款';
            break;
          case 'PROCESSING':
            desc = '製作中';
            break;
          case 'CANCELLED':
            desc = '取消';
            break;
          case 'SHIPPED':
            desc = '已寄出';
            break;
          case 'DELIVERED':
            desc = '已交付';
            break;
          case 'COMPLETED':
            desc = '完成';
            break;
          default:
            desc = 'NEW';
        }
        return desc;
      }
    },


		updatedAt: {
			type: Sequelize.DATE,
			get: function () {
				try {
					return moment(this.getDataValue('updatedAt')).format("YYYY/MM/DD HH:mm:SS");
				} catch (e) {
					sails.log.error(e);
				}
			}
		},

		createdAt: {
			type: Sequelize.DATE,
			get: function () {
				try {
					return moment(this.getDataValue('createdAt')).format("YYYY/MM/DD HH:mm:SS");
				} catch (e) {
					sails.log.error(e);
				}
			}
		},

	},
	associations: () => {
		EventOrder.belongsTo(User);
		EventOrder.belongsTo(Event);
		Allpay.belongsTo(EventOrder);
	},
	options: {
		classMethods: {
			findByIdHasJoin: async(id) => {
				try {
					return await RecipeOrder.findOne({
						where: {
							id
						},
						include: [User, Recipe]
					});
				} catch (e) {
					sails.log.error(e);
					throw e;
				}
			},
			deleteById: async(id) => {
				try {
					return await RecipeOrder.destroy({
						where: {
							id
						}
					});
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
