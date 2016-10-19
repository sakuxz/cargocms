module.exports = {
  'api/labfnp/RecipeController': {
    'index': ['nocache'],
    'findOne': ['nocache'],
    'create': ['nocache'],
    'update': ['nocache'],
    'delete': ['nocache'],
  },
  'labfnp/RecipeController': {
    'create': ['passport', 'sessionAuth'],
    'order': ['passport', 'sessionAuth'],
    'update': ['nocache'],
    'allpay': ['passport', 'sessionAuth'],
    'done': ['passport', 'sessionAuth'],
  },
  'api/admin/ImageController': {
    //'upload': ['passport', 'sessionAuth'],
    'destroy': ['passport', 'sessionAuth'],
  },
}
