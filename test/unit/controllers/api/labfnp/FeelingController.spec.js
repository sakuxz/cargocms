describe.only('about admin api Feeling Controller operation.', function() {
  describe('create a feeling with scent.', () => {
    let feeling, feeling2;
    before( async(done) => {
      try{
        await Scent.create({
          "name": "BU2",
          "title": "Ambroxan",
          "description": "濃郁而優雅的琥珀味，當中含豐富的木質香氣，提供香水溫暖調性。從優雅的花香調到現代東方調都適用。由於其香氣濃郁性，使用低劑量即可達最佳效果。相反的，高劑量使用可以增加持久性。",
          "sequence": 2,
          "feelings": [{key:"木質",value:"7"},{key:"日曬干草",value:"1"},{key:"紙味",value:"1"},{key:"沉靜",value:"1"},{key:"和平",value:"1"},{key:"日式房子",value:"1"},{key:"小木屋",value:"2"},{key:"大樹",value:"1"},{key:"清爽的樹皮",value:"1"},{key:"老舊的",value:"1"},{key:"風吹過木頭",value:"1"},{key:"走在阿公家",value:"1"},{key:"男人味",value:"3"},{key:"帥的人味",value:"1"},{key:"溫柔男子",value:"1"},{key:"中年客人的味道",value:"1"},{key:"CK味",value:"1"},{key:"噴太多古龍水",value:"1"},{key:"外國人",value:"1"},{key:"暖甜",value:"1"},{key:"柔和",value:"1"},{key:"厚實",value:"1"},{key:"深沈",value:"3"},{key:"辛辣",value:"1"},{key:"酒吧",value:"1"},{key:"蒸餾酒",value:"1"},{key:"瑪格麗特（調酒）",value:"1"},{key:"Vodka",value:"1"},{key:"琥珀",value:"2"},{key:"古龍水",value:"1"},{key:"森林",value:"1"},{key:"芬多精",value:"2"},{key:"麥克筆的味道",value:"1"},{key:"顏料",value:"1"},{key:"膨膨沐浴露",value:"1"}],
          // "ScentNoteId": 7
        });

        await Scent.create({
          "name": "C4",
          "title": "Explosion Explosion Explosion",
          "description": "遇到任何問題，用C4就對了。",
          "sequence": 3,
          "feelings": [],
        });

        feeling = await Feeling.create({
          "title": "木質",
          "scentName": "BU2",
          "totalRepeat": "22",
          "score": "7",
        });

        feeling2 = await Feeling.create({
          "title": "木質",
          "scentName": "BJ4",
          "totalRepeat": "22",
          "score": "1",
        });

        done();
      } catch (e) {
        done(e);
      }

    });

    it('Create a new Feeling with title 木質, scentName C4, 木質 totalRepeat should Add 1.', async (done) => {
      try{
        const data = {
          title: "木質",
          scentName: "C4",
          score: "1"
        };
        const res = await request(sails.hooks.http.app)
        .post(`/api/labfnp/feeling`).send(data);

        let result = await Feeling.findOne({
          where: {
            id : feeling.id
          }
        })

        result.totalRepeat.should.be.equal("23");

        done();
      } catch (e) {
        done(e);
      }
    });

  });
});
