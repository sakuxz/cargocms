module.exports = {
  'api/labfnp/RecipeOrderController': {
    'find': ['passport', 'sessionAuth', 'jwtDecode'],
  },
  'api/labfnp/RecipeController': {
    create: ['passport', 'sessionAuth', 'jwtDecode'],
    update: ['passport', 'sessionAuth', 'jwtDecode'],
    destroy: ['passport', 'sessionAuth', 'jwtDecode'],
  },
  'labfnp/RecipeController': {
    'create': ['passport', 'sessionAuth', 'jwtDecode'],
    'order': ['passport', 'sessionAuth'],
    'feedback': ['passport', 'sessionAuth'],
    'allpay': ['passport', 'sessionAuth'],
    'done': ['passport', 'sessionAuth'],
    'show': ['nocache', 'passport'],
  },
  'labfnp/MainController': {
    'explore': ['nocache', 'passport', 'jwtDecode'],
    'portfolio': ['nocache'],
    'editPofile': ['nocache'],
    'validateEmail': [],
  },
  'api/admin/labfnp/RecipeController': {
    'find': ['passport', 'sessionAuth', 'isAdmin'],
    'findOne': ['passport', 'sessionAuth', 'isAdmin'],
    'create': ['passport', 'sessionAuth', 'isAdmin'],
    'update': ['passport', 'sessionAuth', 'isAdmin'],
    'destroy': ['passport', 'sessionAuth', 'isAdmin'],
  },
  'api/admin/labfnp/FeelingController': {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
    'find': ['passport', 'sessionAuth'],
  }
}
