
/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  //----- index -----
  '/': {
    view: 'index'
  },

  //----- api -----
  'get /api/admin/mock': "api/admin/MockController.find",

  'post /api/admin/upload': 'api/admin/ImageController.upload',
  'delete /api/admin/upload/:id': 'api/admin/ImageController.destroy',

  'get /api/labfnp/recipe/findForLab': 'api/labfnp/RecipeController.findForLab',
  'get /api/labfnp/recipe': 'api/labfnp/RecipeController.find',
  'post /api/labfnp/recipe': 'api/labfnp/RecipeController.create',
  'get /api/labfnp/recipe/new': 'api/labfnp/RecipeController.topNew',
  'get /api/labfnp/recipe/:id': 'api/labfnp/RecipeController.findOne',
  'put /api/labfnp/recipe/:id': 'api/labfnp/RecipeController.update',
  'delete /api/labfnp/recipe/:id': 'api/labfnp/RecipeController.destroy',

  'get /api/labfnp/recipe/:id/feelings': 'api/labfnp/RecipeController.feelings',

  'get /api/labfnp/feeling': 'api/labfnp/FeelingController.find',
  'get /api/labfnp/feeling/:id': 'api/labfnp/FeelingController.findOne',
  'post /api/labfnp/feeling': 'api/labfnp/FeelingController.create',
  'put /api/labfnp/feeling/:id': 'api/labfnp/FeelingController.update',
  'delete /api/labfnp/feeling/:id': 'api/labfnp/FeelingController.destroy',

  'get /api/labfnp/recipe/like/:id': 'api/labfnp/RecipeController.like',
  'get /api/labfnp/recipe/unlike/:id': 'api/labfnp/RecipeController.unlike',
  'post /api/labfnp/recipe/feedback': 'api/labfnp/RecipeController.saveFeedback',

  'get /api/labfnp/scent/simpleList': 'api/labfnp/ScentController.find',
  'get /api/labfnp/scent': 'api/labfnp/ScentController.find',
  'get /api/labfnp/scentnote': 'api/labfnp/ScentNoteController.find',

  'get /api/admin/user': 'api/admin/UserController.find',
  'get /api/admin/user/:id': 'api/admin/UserController.findOne',
  'post /api/admin/user': 'api/admin/UserController.create',
  'put /api/admin/user/:id': 'api/admin/UserController.update',
  'delete /api/admin/user/:id': 'api/admin/UserController.destroy',

  'get /api/admin/post': 'api/admin/PostController.find',
  'get /api/admin/post/:id': 'api/admin/PostController.findOne',
  'post /api/admin/post': 'api/admin/PostController.create',
  'put /api/admin/post/:id': 'api/admin/PostController.update',
  'delete /api/admin/post/:id': 'api/admin/PostController.destroy',


  'get /api/admin/slogan': 'api/admin/SloganController.find',
  'get /api/admin/slogan/:id': 'api/admin/SloganController.findOne',
  'post /api/admin/slogan': 'api/admin/SloganController.create',
  'put /api/admin/slogan/:id': 'api/admin/SloganController.update',
  'delete /api/admin/slogan/:id': 'api/admin/SloganController.destroy',

  'get /api/admin/allpay':        'api/admin/AllpayController.find',
  'get /api/admin/allpay/export': 'api/admin/AllpayController.export',
  'get /api/admin/allpay/:id':    'api/admin/AllpayController.findOne',
  'post /api/admin/allpay':       'api/admin/AllpayController.create',
  'put /api/admin/allpay/:id':    'api/admin/AllpayController.update',
  'delete /api/admin/allpay/:id': 'api/admin/AllpayController.destroy',
  'post /api/allpay/paid':        'api/admin/AllpayController.paid',
  'post /api/allpay/paymentinfo': 'api/admin/AllpayController.paymentinfo',

  'get /api/admin/message':        'api/admin/MessageController.find',
  'get /api/admin/message/:id':    'api/admin/MessageController.findOne',
  'post /api/admin/message':       'api/admin/MessageController.create',
  'put /api/admin/message/:id':    'api/admin/MessageController.update',
  'delete /api/admin/message/:id': 'api/admin/MessageController.destroy',

  'get /api/admin/labfnp/recipe/export': 'api/admin/labfnp/RecipeController.export',

  // 'get /api/admin/Default': 'api/admin/DefaultController.find',
  // 'get /api/admin/Default/:id': 'api/admin/DefaultController.findOne',
  // 'post /api/admin/Default': 'api/admin/DefaultController.create',
  // 'put /api/admin/Default/:id': 'api/admin/DefaultController.update',
  // 'delete /api/admin/Default/:id': 'api/admin/DefaultController.destroy',

  'post /api/user/follow/:id':    'api/UserController.follow',
  'post /api/user/unfollow/:id':  'api/UserController.unfollow',
  'post /api/user/edit/:id':      'api/UserController.update',

  //----- custom -----

  '/admin':           'AdminController.index',
  '/admin/config.js': 'AdminController.config',

  '/recipe/:id':      'labfnp/RecipeController.show',
  // '/recipe/preview/:id': 'labfnp/RecipeController.preview',
  '/recipe/order/:id': 'labfnp/RecipeController.order',
  '/recipe/feedback/:id': 'labfnp/RecipeController.feedback',
  '/recipe/edit/:id': 'labfnp/RecipeController.edit',
  '/recipe/allpay/:id':  'labfnp/RecipeController.allpay',
  '/creator':         'labfnp/RecipeController.create',
  '/lab':             'labfnp/MainController.explore',
  '/me/:id?':         'labfnp/MainController.portfolio',
  '/edit/me':         'labfnp/MainController.editPofile',


  //----- AuthController -----
  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /register': 'AuthController.register',

  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  //----- view -----
  "/labfnp/:controller/:action/:id?": {},
  "/admin/:controller/:action/:id?": {},

  "/:controller/:action/:id?": {},

  //----- WallController -----
  'get /wall/:id': 'WallController.show',


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
