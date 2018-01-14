module.exports = {
  attributes: {
    name: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    sequence: {
      type: Sequelize.INTEGER,
    },
    feelings: {
      type: Sequelize.TEXT,
      set(val) {
        if (val) {
          this.setDataValue('feelings', JSON.stringify(val));
        } else {
          this.setDataValue('feelings', '[]');
        }
      },
      get() {
        try {
          let feelings = this.getDataValue('feelings');
          if (feelings) {
            return JSON.parse(feelings);
          }

          return [];
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    },
    displayFeeling: {
      type: Sequelize.VIRTUAL,
      get() {
        try {
          const feelings = this.getDataValue('feelings');

          if (feelings) {
            const dataJson = JSON.parse(feelings);
            const NumOfData = dataJson.length;
            const displayFeeling = [];
            for (let i = 0; i < NumOfData; i++) {
              displayFeeling.push(dataJson[i].key);
            }
            return displayFeeling;
          }
          return [];
        } catch (e) {
          sails.log.error(e);
          return [];
        }
      },
    },
    createdDateTime: {
      type: Sequelize.VIRTUAL,
      get() {
        try {
          return UtilsService.DataTimeFormat(this.getDataValue('createdAt'));
        } catch (e) {
          sails.log.error(e);
          return null;
        }
      },
    },

    updatedDateTime: {
      type: Sequelize.VIRTUAL,
      get() {
        try {
          return UtilsService.DataTimeFormat(this.getDataValue('updatedAt'));
        } catch (e) {
          sails.log.error(e);
          return null;
        }
      },
    },

    coverUrl: {
      type: Sequelize.STRING,
      defaultValue: '',
      get() {
        try {
          // const thisId = this.getDataValue('id');
          // const thisImage = this.getDataValue('Image');
          const thisName = this.getDataValue('name');
          const imageUrl = `assets/labfnp/img/scent-cover/${thisName}.jpg`;
          return UtilsService.getUrl(imageUrl);
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },
  },
  associations() {
    Scent.belongsTo(ScentNote);
    // Scent.hasMany(Feeling, {
    //   foreignKey: {
    //     name: 'ScentId'
    //   }
    // });
  },
  options: {
    timestamps: false,
    paranoid: true,
    classMethods: {

      /**
       * 查詢所有香味分子
       */
      async findAllWithRelation() {
        return await Scent.findAll({
          include: [
            ScentNote,
          ],
          order: 'sequence ASC',
        });
      },

      async formatForApp({ scents }) {
        const result = scents.map((scent) => {
          const { id, name, sequence, feelings, title, description, displayFeeling } = scent;
          let color = '';
          let scentNote = '';
          if (scent.ScentNote) {
            scentNote = scent.ScentNote.toJSON();
            color = scent.ScentNote.color;
          }

          // let feelings = scent.Feelings.map((feeling) => {
          //   let {id, title} = feeling;
          //   return {id, title}
          // });

          return { id, sequence, name, color, feelings, title, description, scentNote, displayFeeling };
        });

        return result;
      },

      async findAllWithRelationFormatForApp() {
        const scents = await Scent.findAllWithRelation();
        const result = await Scent.formatForApp({ scents });
        return result;
      },

    },
    instanceMethods: {},
    hooks: {},
  },
};
