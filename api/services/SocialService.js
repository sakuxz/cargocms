module.exports = {
  getShareUrl: function() {
    const url = sails.config.appUrl
    return url;
  },

  getFBPageId: function() {
    const pageId = sails.config.facebook.pageId;
    return pageId;
  },
  getFBAppId: function() {
    const appId = sails.config.facebook.appId;
    return appId;
  },

  forRecipe: ({recipes}) => {
    try {
      let socialsConfig = sails.config.socials

      const socialData = recipes.map((recipe) => {
        const {id, hashId, description} = recipe;
        const title = recipe.perfumeName;
        const recipeId = hashId || id
        const url = SocialService.getShareUrl() + '/recipe/' + recipeId
        return {
          description, title, url
        }
      });

      let social = {
        data: socialData,
        targets: socialsConfig
      };
      return social;
    } catch (e) {
      throw e;
    }
  },

  forPost: ({posts}) => {
    try {
      let socialsConfig = sails.config.socials

      const socialData = posts.map((post) => {
        const {id, title, type, alias} = post;
        const description = "";
        let url = ''
        let domain = SocialService.getShareUrl();
        if (type === 'blog') {
          url = `${domain}/blogs/${ alias || id}`
        } else {
          url = `${domain}/events/${ alias || id}`
        }
        return {
          description, title, url
        }
      });

      let social = {
        data: socialData,
        targets: socialsConfig
      };
      return social;
    } catch (e) {
      throw e;
    }
  }

}
