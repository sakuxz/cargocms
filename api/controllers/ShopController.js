module.exports = {
  done: async (req, res) => {
    try {
      const merchantTradeNo = req.query.t;
      const item = await Allpay.findOne({
        where:{
          MerchantTradeNo: merchantTradeNo
        },
        include:{
          model: RecipeOrder,
          include: [User, Recipe]
        }
      });

      if(!item){
        throw Error(`找不到 ${merchantTradeNo} 編號的交易`);
      }
      res.view('shop/done', {item} );


    } catch (e) {
      res.serverError(e);
    }
  }
}
