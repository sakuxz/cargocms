

module.exports.init = async () => {
  try {

    FacebookService.feedsImport();

  } catch (e) {
    console.error(e);
  }
};
