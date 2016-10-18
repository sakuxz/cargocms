

module.exports = {
  login: async (user) => {
    try {
      console.log("=== login ===");
      await browser.windowHandleSize({width:1280,height:900}).url('/');
      // expect(browser.getTitle()).to.equal('LFP: 香料香水實驗室，客製專屬香水');
      await browser.click('#login');
      await browser.pause(1000);
      await browser.setValue('#identifier', user)
      await browser.setValue('#password', user)
      await browser.click('#submit-button');

    } catch (e) {
      throw e;
    }
  },

  logout: async () => {
    try {
      console.log("=== logout ===");
      await browser.url('/logout');

    } catch (e) {
      throw e;
    }
  }
}
