module.exports = {
  attributes: {
    //TODO message(string)
    //TODO totalDrops (int)
    //TODO coverPhoto (url as string)
    //TODO authorAvatar
    formula: {
      // from `full_picture`
      type: Sequelize.TEXT,
      set: function (val) {
        if (val) {
          this.setDataValue('formula', JSON.stringify(val));
        }
        else {
          this.setDataValue('formula', "[]");
        }
      },
      get: function () {
        var formula = this.getDataValue('formula');
        return JSON.parse(formula);
      }
    },
    formulaLogs: {
      type: Sequelize.TEXT
    },
    authorName: {
      type: Sequelize.STRING,
    },
    perfumeName: {
      type: Sequelize.STRING,
    }
  },
  associations: function() {
    Recipe.belongsTo(User);
  },
  options: {
    classMethods: {
      findOneWithScent: async function({id}) {
        sails.log.info("findOneWithUser id=>", id);
        let recipeWithScent = '';
        const recipes = await Recipe.findOne({
          where: {
            id
          },
          include: User,
        });
        console.log("displayName=>", recipes.User.displayName);
        // if (recipes) {
        //   recipeWithScent = recipes.toJSON();
        //   const scents = await Scent.findAll();
        //   const scentArray = scents.map((scent) => scent.name);
        //   recipeWithScent.scents = scentArray;
        //
        //   console.log("recipeWithScent=>", recipeWithScent);
        // }
        return recipes;
      },
      deleteById: async (id) => {
        try {
          return await Recipe.destroy({ where: { id } });
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
