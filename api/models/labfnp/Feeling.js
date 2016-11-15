import moment from 'moment';
module.exports = {
  attributes: {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },

    scentName: {
      type: Sequelize.STRING,
      allowNull: false
    },

    totalRepeat: {
      type: Sequelize.STRING,
      defaultValues: 0
    },

    score: {
      type: Sequelize.STRING,
      defaultValues: 0
    },

    updatedAt: {
      type: Sequelize.DATE,
      get: function() {
        try {
          return moment(new Date(this.getDataValue('updatedAt'))).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    createdAt: {
      type: Sequelize.DATE,
      get: function() {
        try {
          return moment(new Date(this.getDataValue('createdAt'))).format("YYYY/MM/DD HH:mm:SS");
        } catch (e) {
          sails.log.error(e);
        }
      }
    },
  },
  associations: function() {
    //Feeling.belongsTo(Scent);
  },
  options: {
    classMethods: {
      findDistinctFeelings: async function() {
        const feelings = await Feeling.findAll({
          attributes: ['title'],
          group: ['Feeling.title']
        });
        return feelings;
      },
      findRamdomFeelings: async function() {
        const feelings = await Feeling.findDistinctFeelings()
        const ramdomFeelings = feelings.sort(function() {
          return .5 - Math.random();
        });
        return ramdomFeelings;
      },

    },
    instanceMethods: {},
    hooks: {}
  }
};
