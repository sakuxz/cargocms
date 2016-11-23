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
      type: Sequelize.ENUM("NEW", "PENDING", "RECEIVED", "REQUESTED", "SUBMITTED", "PAID", "PROCESSING", "CANCELLED", "SHIPPED", "DELIVERED", "COMPLETED"),
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
    shipping: {
      type: Sequelize.STRING,
    },
    trackingNumber: {
      type: Sequelize.STRING,
    },
		ItemNameArray: {
			type: Sequelize.VIRTUAL,
			get: function () {
				try {
					const thisRecipe = this.getDataValue('Recipe');
					const recipe = thisRecipe ? [thisRecipe.perfumeName] : [];
					return recipe;
				} catch (e) {
					sails.log.error(e);
				}
			}
		},
    createdDateTime:{
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('createdAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    },

    updatedDateTime:{
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('updatedAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    }

	},
	associations: () => {
		RecipeOrder.belongsTo(User);
		RecipeOrder.belongsTo(Recipe);
		Allpay.belongsTo(RecipeOrder);
	},
	options: {
		paranoid: true,
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
