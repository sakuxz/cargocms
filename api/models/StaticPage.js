/**
 * StaitcPage static page content management
 */
module.exports = {
  attributes: {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    html: {
      type: Sequelize.TEXT,
    },
    css: {
      type: Sequelize.TEXT,
    },
    javascript: {
      type: Sequelize.TEXT,
    },
  },
};
