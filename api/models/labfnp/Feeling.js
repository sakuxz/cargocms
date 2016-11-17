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

  },
  associations: function() {
    //Feeling.belongsTo(Scent);
  },
  options: {
    classMethods: {
      deleteById: async (id) => {
        try {
          return await Feeling.destroy({ where: { id } });
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
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
