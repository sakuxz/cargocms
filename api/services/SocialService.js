// import _ from 'lodash';

module.exports = {
  getShareUrl() {
    const url = sails.config.appUrl;
    return url;
  },

  getFBPageId() {
    const pageId = sails.config.facebook.pageId;
    return pageId;
  },
  getFBAppId() {
    const appId = sails.config.facebook.appId;
    return appId;
  },

  forRecipe: ({ recipes }) => {
    try {
      const socialsConfig = sails.config.socials;

      const socialData = recipes.map((recipe) => {
        const { id, hashId, description } = recipe;
        const title = recipe.perfumeName;
        const recipeId = hashId || id;
        const url = `${SocialService.getShareUrl()}/recipe/${recipeId}`;
        return {
          description, title, url,
        };
      });

      const social = {
        data: socialData,
        targets: socialsConfig,
      };
      return social;
    } catch (e) {
      throw e;
    }
  },

  forPost: (posts) => {
    try {
      const socialsConfig = sails.config.socials;
      const socialsPosts = JSON.parse(JSON.stringify(posts));

      const socialData = socialsPosts.map((post) => {
        const { id, title, type, alias } = post;
        const description = '';
        let url = '';
        const domain = SocialService.getShareUrl();
        if (type === 'blog') {
          url = `${domain}/blogs/${alias || id}`;
        } else {
          url = `${domain}/events/${alias || id}`;
        }
        return {
          description, title, url,
        };
      });

      const social = {
        data: socialData,
        targets: socialsConfig,
      };
      return social;
    } catch (e) {
      throw e;
    }
  },

};
