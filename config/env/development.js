/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
  appUrl: 'cargo-dev.trunksys.com',
  port: 5001,
  socials: ["facebook", "googleplus", "twitter"],
  models: {
    connection: 'sqlite',
    migrate: 'drop'
  },
  verificationEmail: false,
  log: {
    level: 'verbose'
  },
  passport: {
    local: {
      strategy: require('passport-local').Strategy
    },
    facebook: {
      name: 'Facebook',
      protocol: 'oauth2',
      strategy: require('passport-facebook').Strategy,
      options: {
        clientID: '144219216008720',
        clientSecret: '',
        callbackURL: "",
        scope: [ 'email', 'public_profile' ],
        profileFields: [
          'id', 'email', 'gender', 'link', 'locale',
          'name', 'timezone', 'updated_time', 'verified',
          'displayName', 'photos'
        ]
      }
    }
  },
  reCAPTCHA: {
    key: '',
    secret: ''
  },
  storage: {
    // locate can be s3 or local
    locate: 'local',
    s3: {
      key: 'Access Key Id',
      secret: 'Secret Access Key',
      // region only can be us-standard
      // other region will get InvalidRequest Error
      region: 'region of bucket',
      bucket: 'bucket name'
    }
  },
  google: {
    name: 'GoogleAPIKey',
    key: 'AIzaSyBSPvypkv-HnFRsC0ZFDvinPMPlEC59Ous'
  },
  layoutImages: {
    icon1: [{
      url: '/assets/labfnp/img/img.index/features-icon-1.png',
      dimension: '568x658',
    }],
    icon2: [{
      url: '/assets/labfnp/img/img.index/features-icon-2.png',
      dimension: '568x658',
    }],
    icon3: [{
      url: '/assets/labfnp/img/img.index/features-icon-3.png',
      dimension: '568x658',
    }],
    slides1: [{
      url: '/assets/labfnp/img/img.index/event-slides/1.jpg',
      dimension: '2048x1074',
    }],
    slides2: [{
      url: '/assets/labfnp/img/img.index/event-slides/2.jpg',
      dimension: '2048x1074',
    }],
    slides3: [{
      url: '/assets/labfnp/img/img.index/event-slides/3.jpg',
      dimension: '2048x1074',
    }],
    slidesm1: [{
      url: '/assets/labfnp/img/img.index/event-slides/1.m.jpg',
      dimension: '1280x1280',
    }],
    slidesm2: [{
      url: '/assets/labfnp/img/img.index/event-slides/2.m.jpg',
      dimension: '1280x1280',
    }],
    slidesm3: [{
      url: '/assets/labfnp/img/img.index/event-slides/3.m.jpg',
      dimension: '1280x1280',
    }],
    backgroundImage1: [{
      url: '/assets/labfnp/img/img.index/lab-background-image.jpg',
      dimension: '1122x1122',
    }],
    backgroundImage2: [{
      url: '/assets/labfnp/img/img.index/why-image.jpg',
      dimension: '1122x1122',
    }],
    backgroundImage3: [{
      url: '/assets/labfnp/img/img.index/believe-image.png',
      dimension: '1122x1122',
    }],
    avatar: [{
      url: '/assets/labfnp/img/img.index/Amy.jpg',
      dimension: '430x430',
    }],
  }
};
