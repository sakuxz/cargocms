module.exports = {
  shippingUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      data.productionStatus = "SHIPPED";
      const message = 'Update success.';
      const item = await RecipeOrder.update(data ,{
        where: { id, },
      });
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },
}
