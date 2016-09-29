
const ScentNoteData = require('./data/ScentNote');
const ScentData = require('./data/Scent');
const ScentDetail = require('./data/ScentDetail.json');
const FeelingData = require('./data/Feeling');

module.exports.init = async () => {
  try {
    const {environment} = sails.config;
    console.log('>>>> config/init/labfnp >>>>');



    let newMenuItems = [
      { icon: 'home', href: '/admin/dashboard', title: '控制台', sequence: 0},
      { icon: 'wrench', href: '#', title: '資料維護', sequence: 1},
      { icon: 'puzzle-piece', href: '#', title: '實驗室', sequence: 2},

      { href: '/admin/user', title: '會員資料', sequence: 20, ParentMenuItemId: 2},
      { href: '/admin/post', title: '內容資料', sequence: 30, ParentMenuItemId: 2},
      { href: '/admin/labfnp/recipe', title: '配方資料', sequence: 40, ParentMenuItemId: 2},
      { href: '/admin/labfnp/scent', title: '香味分子', sequence: 50, ParentMenuItemId: 2},
      { href: '/admin/labfnp/scentnote', title: '香調', sequence: 60, ParentMenuItemId: 2},
      { href: '/admin/labfnp/feeling', title: '感覺', sequence: 70, ParentMenuItemId: 2},
      { href: '/admin/slogan', title: '口號', sequence: 80, ParentMenuItemId: 2},
      { href: '/admin/allpay', title: '訂單', sequence: 90, ParentMenuItemId: 2},
      { href: '/admin/message', title: '訊息', sequence: 100, ParentMenuItemId: 2},

      { href: '/admin/mock', title: '隨機資料表', sequence: 20, ParentMenuItemId: 3}

    ]

    let title = newMenuItems.map(item => item.title)
    let findMenuItems = await MenuItem.findAll({where:{title}})
    let findTitle = findMenuItems.map(item => item.title)



    let createMenuItems = title.reduce((result, title, index) => {
      if(findTitle.indexOf(title) == -1){
        result.push(newMenuItems[index])
        return result
      }
      return result
    }, [])


    await MenuItem.bulkCreate(createMenuItems);

    if (environment == 'production') return ;

    ScentDetail.rows.forEach(function(scentDetail){
      Scent.create({
        sequence: parseInt(scentDetail.name.replace(/[^0-9]+/, '')),
        name: scentDetail.name,
        title: scentDetail.title,
        description: scentDetail.description,
      })
    });

    Feeling.bulkCreate(FeelingData.rows).then(() => {
      ScentNoteData.rows.forEach(function(row) {
        ScentNote.create(row).then(function(scentNote) {

          ScentData.rows.forEach(function(row) {
            if (row.scentNote == scentNote.title) {
              row.scents.forEach(function(scentName) {
                Scent.findOne({
                  where: {
                    name: scentName,
                  }
                }).then(function(scent) {
                  if (scent) {

                    Feeling.findAll({where: {scentName: scentName}}).then((feelings) => {

                      feelings = feelings.map((feeling) => {
                        const key = feeling.title
                        const value = feeling.score
                        return {key, value}
                      })

                      scent.ScentNoteId = scentNote.id;
                      scent.feelings = feelings
                      scent.save();
                    })
                  }
                });
              })
            }
          });

        });
      });

    })


    const feeling = {
      title: '花香',
      scentName: 'BT99',
      totalRepeat: 4,
      score: 10,
    };
    await Feeling.create(feeling);



  } catch (e) {
    console.error(e);
  }
};
