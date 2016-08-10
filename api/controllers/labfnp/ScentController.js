module.exports = {
  index: async function(req, res) {
    try {
      console.log("=== enter index ===");
      let data = await Scent.findAllWithRelationFormatForApp();
      return res.ok({data})

    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  },

  find: async (req, res) => {
    console.log("=== find ===");
    try {
      const scents = await Scent.findAll();
      const scentArray = scents.map((scent) => {
        return {
          name: scent.name,
          id: scent.id,
        };
      });
      res.ok({
        data: {
          items: scentArray,
      }});
    } catch (e) {
      res.serverError({ message: e, data: {}});
    }
  },
}
