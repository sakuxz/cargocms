module.exports = {
  'api/labfnp/RecipeOrderController': {
    find: ['jwtDecode', 'passport', 'sessionAuth'],
  },
  'api/labfnp/RecipeController': {
    create: ['jwtDecode', 'passport', 'sessionAuth'],
    update: ['jwtDecode', 'passport', 'sessionAuth'],
    destroy: ['jwtDecode', 'passport', 'sessionAuth'],
    findUserRecipe: ['jwtDecode', 'passport', 'sessionAuth'],
    findUserFavorite: ['jwtDecode', 'passport', 'sessionAuth'],
  },
  'labfnp/RecipeController': {
    create: ['jwtDecode', 'passport', 'sessionAuth'],
    order: ['jwtDecode', 'passport', 'sessionAuth'],
    feedback: ['jwtDecode', 'passport', 'sessionAuth'],
    allpay: ['jwtDecode', 'passport', 'sessionAuth'],
    done: ['jwtDecode', 'passport', 'sessionAuth'],
    show: ['jwtDecode', 'nocache', 'passport'],
  },
  'labfnp/MainController': {
    explore: ['jwtDecode', 'nocache', 'passport'],
    portfolio: ['jwtDecode', 'nocache'],
    editPofile: ['jwtDecode', 'nocache'],
    validateEmail: [],
  },
  'api/admin/labfnp/RecipeController': {
    find: ['passport', 'sessionAuth', 'isAdmin'],
    findOne: ['passport', 'sessionAuth', 'isAdmin'],
    create: ['passport', 'sessionAuth', 'isAdmin'],
    update: ['passport', 'sessionAuth', 'isAdmin'],
    destroy: ['passport', 'sessionAuth', 'isAdmin'],
  },
  'api/admin/labfnp/FeelingController': {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
    find: ['passport', 'sessionAuth'],
  },
};

