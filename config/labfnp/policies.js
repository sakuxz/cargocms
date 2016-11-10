module.exports = {
  'api/labfnp/RecipeOrderController': {
    'find': ['passport', 'sessionAuth'],
  },
  'labfnp/RecipeController': {
    'create': ['passport', 'sessionAuth'],
    'order': ['passport', 'sessionAuth'],
    'feedback': ['passport', 'sessionAuth'],
    'allpay': ['passport', 'sessionAuth'],
    'done': ['passport', 'sessionAuth'],
    'show': ['nocache', 'passport'],
  },
  'labfnp/MainController': {
    'explore': ['nocache', 'passport']
  },
  'api/admin/ImageController': {
    'destroy': ['passport', 'sessionAuth'],
  },
}
