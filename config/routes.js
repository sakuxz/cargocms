
/**
 * Route Mappings
 * (sails.config.routes)
 */


import customConfigLoader from './util/customConfigLoader.js';

var customConfig = customConfigLoader('routes.js');

var defaultConfig = {

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


  //----- api -----
  'get /api/admin/mock': "api/admin/MockController.find",

  'post /api/admin/upload': 'api/admin/ImageController.upload',
  'delete /api/admin/upload/:id': 'api/admin/ImageController.destroy',

  'post /api/admin/user/exportBirthday': 'api/user/UserController.exportBirthday',
  'get /api/admin/user': 'api/admin/UserController.find',
  'get /api/admin/user/:id': 'api/admin/UserController.findOne',
  'post /api/admin/user': 'api/admin/UserController.create',
  'put /api/admin/user/:id': 'api/admin/UserController.update',
  'delete /api/admin/user/:id': 'api/admin/UserController.destroy',

  'get /api/admin/post': 'api/admin/PostController.find',
  'get /api/admin/post/:id': 'api/admin/PostController.findOne',
  'post /api/admin/post': 'api/admin/PostController.create',
  'put /api/admin/post/changePublish/:id': 'api/admin/PostController.changePublish',
  'put /api/admin/post/:id': 'api/admin/PostController.update',
  'delete /api/admin/post/:id': 'api/admin/PostController.destroy',


  'get /api/admin/quote': 'api/admin/QuoteController.find',
  'get /api/admin/quote/:id': 'api/admin/QuoteController.findOne',
  'post /api/admin/quote': 'api/admin/QuoteController.create',
  'put /api/admin/quote/:id': 'api/admin/QuoteController.update',
  'delete /api/admin/quote/:id': 'api/admin/QuoteController.destroy',

  'post /api/admin/allpay/find':  'api/admin/AllpayController.find',
  'post /api/admin/allpay/export': 'api/admin/AllpayController.export',
  'post /api/admin/allpay/exportSend': 'api/admin/AllpayController.exportSend',
  'post /api/admin/allpay/exportExcel': 'api/admin/AllpayController.exportExcel',
  'post /api/admin/allpay/exportSendExcel': 'api/admin/AllpayController.exportSendExcel',
  'post /api/admin/allpay/import/trackingNumber': 'api/admin/AllpayController.importTrackingNumberExcel',
  'put /api/admin/allpay/trackingNumber': 'api/admin/AllpayController.updateTrackingNumberfromExcel',

  'get /api/admin/allpay/:id':    'api/admin/AllpayController.findOne',
  'post /api/admin/allpay':       'api/admin/AllpayController.create',
  'put /api/admin/allpay/:id':    'api/admin/AllpayController.update',
  'delete /api/admin/allpay/:id': 'api/admin/AllpayController.destroy',

  'get /api/admin/message':        'api/admin/MessageController.find',
  'get /api/admin/message/:id':    'api/admin/MessageController.findOne',
  'post /api/admin/message':       'api/admin/MessageController.create',
  'put /api/admin/message/:id':    'api/admin/MessageController.update',
  'delete /api/admin/message/:id': 'api/admin/MessageController.destroy',

  'post /api/user/follow/:id':    'api/UserController.follow',
  'post /api/user/unfollow/:id':  'api/UserController.unfollow',
  'post /api/user/edit':      'api/UserController.update',
  'post /api/user/forgotPassword':'api/UserController.forgotPassword',
  'post /api/user/password':       'api/UserController.updatePassword',
  'get /api/user/validate/resend':  'api/UserController.validateResend',

  'post /api/contact':       'api/ContactController.create',
  'get /api/admin/contact':        'api/admin/ContactController.find',
  'get /api/admin/contact/:id':    'api/admin/ContactController.findOne',
  // 'post /api/admin/contact':       'api/admin/ContactController.create',
  // 'put /api/admin/contact/:id':    'api/admin/ContactController.update',
  'delete /api/admin/contact/:id': 'api/admin/ContactController.destroy',

  'get /api/admin/event':        'api/admin/EventController.find',
  'get /api/admin/event/new':    'api/admin/EventController.findNewEvent',
  'get /api/admin/event/:id':    'api/admin/EventController.findOne',
  'get /api/admin/event/new/:id':'api/admin/EventController.findByPostOrNew',
  'post /api/admin/event':       'api/admin/EventController.create',
  'put /api/admin/event/:id':    'api/admin/EventController.update',
  'delete /api/admin/event/:id': 'api/admin/EventController.destroy',
  'post /api/event/paid':        'api/admin/EventController.paid',
  'post /api/event/paymentinfo': 'api/admin/EventController.paymentinfo',

  'post /api/admin/eventallpay/find':  'api/admin/EventAllpayController.find',
  'post /api/admin/eventallpay/export': 'api/admin/EventAllpayController.exportExcel',
  'post /api/admin/eventallpay/exportSign': 'api/admin/EventAllpayController.exportSignExcel',
  'get /api/admin/eventallpay/:id':    'api/admin/EventAllpayController.findOne',
  // 'post /api/admin/eventallpay':       'api/admin/EventAllpayController.create',
  'put /api/admin/eventallpay/:id':    'api/admin/EventAllpayController.update',
  'delete /api/admin/eventallpay/:id': 'api/admin/EventAllpayController.destroy',
  'put /api/admin/eventorder/status/:id': 'api/admin/EventOrderController.updateProductionStatus',

  'get /api/admin/download': 'api/admin/DownloadController.download',

  'get /api/admin/facebook/feed':        'api/admin/facebook/FeedController.find',
  'get /api/admin/facebook/import':        'api/admin/facebook/FeedController.import',
  'put /api/admin/facebook/update':        'api/admin/facebook/FeedController.update',

  'get /api/admin/labfnp/scent':  'api/admin/labfnp/ScentController.find',
  'get /api/admin/labfnp/scentnote':  'api/admin/labfnp/ScentNoteController.find',
  
  'get /api/admin/config': 'api/admin/ConfigController.find',
  'get /api/admin/config/:id': 'api/admin/ConfigController.findOne',
  'post /api/admin/config': 'api/admin/ConfigController.create',
  'put /api/admin/config/:id': 'api/admin/ConfigController.update',
  'delete /api/admin/config/:id': 'api/admin/ConfigController.destroy',
  'post /api/admin/config/reload': 'api/admin/ConfigController.reload',

  //----- Event -----
  'get /events/:name': 'EventController.show',

  //----- Blog -----
  'get /blogs/:name': 'BlogController.show',

  //----- Admin -----
  '/admin':           'AdminController.index',
  '/admin/config.js': 'AdminController.configJson',

  //----- AuthController -----
  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'post /logout': 'AuthController.logout',
  'get /register': 'AuthController.register',
  'get /forgot': 'AuthController.forgot',

  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  //----- WallController -----
  'get /wall/:id': 'WallController.show',

  //----- Facebook -----
  'get /admin/facebook/:controller/:action/:id?': {},

  //----- robots ---
  'get /robots.txt': 'RobotsController.robots',

  //---- mobile ----
  'get /m': '/',
  'get /mobile': '/',
};

module.exports.routes = {
  '/': 'labfnp/MainController.index',
  ...customConfig,
  ...defaultConfig,
  "/admin/:controller/:action/:id?": {},
  "/:controller/:action/:id?": {}
};
