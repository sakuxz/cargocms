module.exports = {
  attributes: {
    icon: {
      type: Sequelize.STRING,
    },
    href: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    sequence: {
      type: Sequelize.INTEGER,
      defaultValues: 0
    },
  },
  associations: function() {
    MenuItem.hasMany(MenuItem, {
      as: 'SubMenuItems',
      foreignKey: {
        name: 'ParentMenuItemId'
      }
    });
  },
  options: {
    classMethods: {
      findAllWithSubMenu: async function () {
        try {
          const {environment} = sails.config;
          let where = {
            ParentMenuItemId: null
          };

          if(environment == 'production'){
            where.title = {
              $ne: "實驗室"
            }
          }



          let menuItems = await MenuItem.findAll({
            where,
            include: {model: MenuItem, as: 'SubMenuItems'},
            order: ['MenuItem.sequence', 'SubMenuItems.sequence']
          });

          return menuItems;

        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    },
    instanceMethods: {},
    hooks: {}
  }
};
