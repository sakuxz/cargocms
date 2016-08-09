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

  '/': {
    view: 'index'
  },

  '/creator': {
    view: 'labfnp/creator/index'
  },

  '/lab': {
    view: 'labfnp/explore'
  },

  //----- AuthController -----
  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /register': 'AuthController.register',

  'get /auth/status': 'AuthController.status',

  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  //----- BlogController -----
  'get /blog': 'BlogController.index',

  'get /wall': 'WallController.index',


  //----- UserController -----
  'get /user': 'UserController.index',
  'get /user/:userId': 'UserController.findOne',
  'put /user/:userId': 'UserController.update',
  'delete /user/:userId': 'UserController.delete',
  'post /user': 'UserController.create',

  //----- PostController -----
  'get /post': 'PostController.index',
  'post /post': 'PostController.create',
  'get /post/:postId': 'PostController.findOne',
  'put /post/:postId': 'PostController.update',
  'delete /post/:postId': 'PostController.delete',

  //----- SloganController -----
  'post /slogan': 'SloganController.create',

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  //----- Admin -----


  '/admin/login': {
    view: 'admin/login',
    locals: {
      layout: false
    }
  },

  '/admin/': {
      controller: 'AdminController',
      action: 'index',
      locals: {
       layout: false
      }
   },

//----- Admin User -----
  '/admin/user': {
    view: 'admin/user/index',
    locals: {
      layout: false
    }
  },
  '/admin/dashboard': {
    view: 'admin/dashboard/index',
    locals: {
      layout: false
    }
  },


  '/admin/user/create': {
    view: 'admin/user/create',
    locals: {
      layout: false
    }
  },
  '/admin/user/edit/:id': {
    view: 'admin/user/edit',
    locals: {
      layout: false
    }
  },
  '/admin/user/show/:id': {
    view: 'admin/user/show',
    locals: {
      layout: false
    }
  },

  '/admin/post': {
    view: 'admin/post/index',
    locals: {
      layout: false
    }
  },

  '/admin/debug': 'AdminController.debug',
};
