import crypto from 'crypto';
import moment from 'moment';

module.exports = {

  index: async (req, res) => {
    try {
      const {type} = req.query
      const order = 'DESC';
      let where = {
        type: ["internal-event", "external-event"]
      }

      const posts = await Post.findAllHasJoin({order, where});
      const social = SocialService.forPost({posts});
      const items = posts;
      const data = {items}

      res.view('event/index', {data, social});
    } catch (e) {
      res.serverError(e);
    }
  },

  show: async (req, res) => {
    try {
      const {id, name} = req.params
      let data = await Post.findByIdHasJoinByEvent({id, name});
      console.log("==== data ====", data);
      const social = SocialService.forPost({posts: [data]});
      res.view('event/show', {data, social});
    } catch (e) {
      res.serverError(e);
    }
  },

  order: async function(req, res) {
    const { id } = req.params;
    try {
      const currentUser = AuthService.getSessionUser(req);
      if (!currentUser) return res.redirect(`/login?url=/event/order/${id}`);

      const event = await Event.findOne({
        where: { id },
      });


      return res.view({ event, user: currentUser });
    } catch (e) {
      if (e.type === 'notFound') return res.notFound();
      return res.serverError(e);
    }
  },

  allpay: async function(req, res) {
    console.log('body=>', req.body);
    try {
      const { id } = req.params;
      const user = AuthService.getSessionUser(req);
      if (!user) return res.redirect(`/login?url=/event/order/${id}`);

      const { recipient, phone, email, address, note, description, paymentMethod } = req.body;
      let eventOrder = await EventOrder.create({
        UserId: user.id,
        EventId: id,
        recipient,
        phone,
        address,
        email,
        note,
      });

      let updateUserPhone = await User.findById(user.id);
      if( !updateUserPhone.phone1 && !updateUserPhone.phone2 ) {
        updateUserPhone.phone1 = phone;
        updateUserPhone = await updateUserPhone.save();
      }

      const event = await Event.findById(id);
      const allPayData = await AllpayService.getAllpayConfig({
        relatedKeyValue: {
          EventOrderId: eventOrder.id,
        },
        MerchantTradeNo: crypto.randomBytes(32).toString('hex').substr(0, 8),
        tradeDesc: event.description,
        totalAmount: event.price,
        paymentMethod: paymentMethod,
        itemArray: [ event.title ],
        clientBackURL: '/event/done',
        returnURL: '/api/event/paid',
        paymentInfoURL: '/api/event/paymentinfo',
      });

      if (paymentMethod == 'gotoShop') {
        // 目前 Event 沒有現場付款選項，先保留
        const item = await Allpay.findOne({
          where:{
            MerchantTradeNo: allPayData.MerchantTradeNo
          },
          include:{
            model: EventOrder,
            include: [User, Event]
          }
        });
        item.RtnMsg = '現場付費';
        item.ShouldTradeAmt = event.price;
        item.TradeAmt = event.price;
        item.PaymentType = '現場付費';
        item.PaymentDate = moment(new Date()).format("YYYY/MM/DD");
        await item.save();

        let messageConfig = {};
        messageConfig.serialNumber = item.MerchantTradeNo;
        messageConfig.paymentTotalAmount = event.price;
        messageConfig.productName = event.title + ' 1 張';
        messageConfig.email = eventOrder.email;
        messageConfig.username = item.EventOrder.User.displayName;
        messageConfig.shipmentUsername = eventOrder.recipient;
        messageConfig.shipmentAddress = eventOrder.address;
        messageConfig.note = eventOrder.note;
        messageConfig.phone = eventOrder.phone;

        event.signupCount = event.signupCount + 1;
        if (event.signupCount > event.limit) {
          throw Error('票卷已賣完');
        }
        await event.save();

        // messageConfig = await MessageService.eventOrderConfirm(messageConfig);
        // const message = await Message.create(messageConfig);
        // await MessageService.sendMail(message);

        res.redirect(`/event/done?t=${allPayData.MerchantTradeNo}`);

      } else {
        return res.view({
          AioCheckOut: AllpayService.getPostUrl(),
          ...allPayData
        });
      }
    } catch (e) {
      req.flash('error', e.toString());
      res.serverError(e, {redirect: '/event/order/' + req.body.id});
    }
  },

  done: async function(req, res) {
    try {
      const merchantTradeNo = req.query.t;
      const item = await Allpay.findOne({
        where:{
          MerchantTradeNo: merchantTradeNo
        },
        include:{
          model: EventOrder,
          include: [User, Event]
        }
      });

      if(!item){
        throw Error(`找不到 ${merchantTradeNo} 編號的交易`);
      }
      res.view('event/done', {item} );

    } catch (e) {
      res.serverError(e);
    }
  },
}
