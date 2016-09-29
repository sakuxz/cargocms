module.exports = {
  attributes: {
  },
  associations: function() {
    UserLikeRecipe.belongsTo(User)
    UserLikeRecipe.belongsTo(Recipe)
    User.hasMany(UserLikeRecipe);
  },
  options: {
    classMethods: {
      createIfNotExist: async function({UserId, RecipeId}) {
        const result = await UserLikeRecipe.findOrCreate({
          where: {UserId, RecipeId},
          defaults: {UserId, RecipeId}
        });
        return result[0];
      }
    },
  }
};
